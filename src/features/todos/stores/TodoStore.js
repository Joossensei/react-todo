import { makeAutoObservable, configure, runInAction } from "mobx";
import { todoService } from "../services/todoService";
import { userService } from "../../users/services/userService";

configure({ enforceActions: "always" });

export class TodoStore {
  todos = [];
  total = 0;
  page = 1;
  size = 10;
  sortBy = "incomplete-priority-desc";
  completedFilter = undefined;
  priorityFilter = "";
  statusFilter = "";
  nextLink = null;
  prevLink = null;

  search = "";

  loading = false;
  error = null;

  cache = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get visibleTodos() {
    const q = String(this.search || "").toLowerCase();
    if (!q) return this.todos;
    return this.todos.filter((t) =>
      String(t.title || "")
        .toLowerCase()
        .includes(q),
    );
  }

  get totalPages() {
    return Math.max(1, Math.ceil((Number(this.total) || 0) / this.size));
  }

  setSearch(value) {
    this.search = value;
  }

  setSort(sort) {
    if (this.sortBy === sort) return;
    this.sortBy = sort;
    this.fetchPage(1);
  }

  setCompletedFilter(filter) {
    const completed =
      filter === "completed"
        ? true
        : filter === "incomplete"
          ? false
          : undefined;
    this.completedFilter = completed;
    this.fetchPage(1);
  }

  setPriorityFilter(priorityKey) {
    this.priorityFilter = priorityKey || "";
    this.fetchPage(1);
  }

  setStatusFilter(statusKey) {
    this.statusFilter = statusKey || "";
    this.fetchPage(1);
  }

  invalidateCache() {
    this.cache.clear();
    this.fetchPage(1);
  }

  async fetchPage(targetPage = 1, force = false) {
    console.log("fetching page", targetPage);
    try {
      this.loading = true;
      this.error = null;
      const queryKey = JSON.stringify({
        size: this.size,
        sort: this.sortBy,
        completed: this.completedFilter,
        priority: this.priorityFilter || undefined,
        status: this.statusFilter || undefined,
      });
      const cacheKey = `${queryKey}|p=${targetPage}`;
      if (this.cache.has(cacheKey) && !force) {
        const data = this.cache.get(cacheKey);
        this._applyPageData(data);
        console.log("cache hit", data);
      } else {
        const data = await todoService.getTodos({
          page: targetPage,
          size: this.size,
          sort: this.sortBy,
          completed: this.completedFilter,
          priority: this.priorityFilter || undefined,
          status: this.statusFilter || undefined,
        });
        console.log("cache miss", data);
        runInAction(() => {
          this.cache.set(cacheKey, data);
          this._applyPageData(data);
        });
      }
    } catch (err) {
      runInAction(() => {
        this.error = err?.message || "Failed to load todos";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
      this.prefetchNext();
      this.prefetchPrev();
    }
  }

  async prefetchNext() {
    if (!this.nextLink) return;
    try {
      const data = await todoService.getTodosByLink(this.nextLink);
      const parsed = new URL(this.nextLink, window.location.origin);
      const nextPage = Number(parsed.searchParams.get("page")) || this.page + 1;
      const queryKey = JSON.stringify({
        size: this.size,
        sort: this.sortBy,
        completed: this.completedFilter,
        priority: this.priorityFilter || undefined,
        status: this.statusFilter || undefined,
      });
      const cacheKey = `${queryKey}|p=${nextPage}`;
      runInAction(() => {
        if (!this.cache.has(cacheKey)) {
          this.cache.set(cacheKey, data);
        }
      });
    } catch (_e) {}
  }

  async prefetchPrev() {
    if (!this.prevLink) return;
    try {
      const data = await todoService.getTodosByLink(this.prevLink);
      const parsed = new URL(this.prevLink, window.location.origin);
      const prevPage =
        Number(parsed.searchParams.get("page")) || Math.max(1, this.page - 1);
      const queryKey = JSON.stringify({
        size: this.size,
        sort: this.sortBy,
        completed: this.completedFilter,
        priority: this.priorityFilter || undefined,
        status: this.statusFilter || undefined,
      });
      const cacheKey = `${queryKey}|p=${prevPage}`;
      runInAction(() => {
        if (!this.cache.has(cacheKey)) {
          this.cache.set(cacheKey, data);
        }
      });
    } catch (_e) {}
  }

  goToNext() {
    console.log("going to next", this.nextLink);
    if (!this.nextLink) return;
    const parsed = new URL(this.nextLink, window.location.origin);
    const nextPage = Number(parsed.searchParams.get("page")) || this.page + 1;
    this.fetchPage(nextPage);
  }

  goToPrev() {
    if (!this.prevLink) return;
    const parsed = new URL(this.prevLink, window.location.origin);
    const prevPage =
      Number(parsed.searchParams.get("page")) || Math.max(1, this.page - 1);
    this.fetchPage(prevPage);
  }

  async refetch(force = false) {
    console.log("refetching page", this.page);
    await this.fetchPage(this.page, force);
  }

  async toggleTodo(key) {
    try {
      this.error = null;
      const todo = this.todos.find((t) => t.key === key);
      if (!todo) return;
      console.log("toggling todo", key, todo);
      await todoService.patchTodo(key, { completed: !todo.completed });
      this.invalidateCache();
      console.log("refetching");
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to update the todo";
      });
    }
  }

  async deleteTodo(key) {
    try {
      this.error = null;
      await todoService.deleteTodo(key);
      this.invalidateCache();
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to delete the todo";
      });
    }
  }

  async editTodo(key, { title, priority, status, description }) {
    try {
      this.error = null;
      const current = this.todos.find((t) => t.key === key);
      if (!current) return;
      await todoService.patchTodo(key, {
        title: title ?? current.title,
        priority: priority ?? current.priority,
        status: status ?? current.status,
        completed: current.completed,
        description: description ?? current.description,
      });
      this.invalidateCache();
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to save changes";
      });
    }
  }

  async addTodo({ title, priority, status, description = "" }) {
    try {
      this.error = null;
      const user_key = userService.getUserKey();
      const payload = {
        title: String(title || "").trim(),
        priority,
        status,
        description,
        completed: false,
        user_key,
      };
      if (!payload.title || !payload.priority) {
        throw new Error("Todo and priority are required");
      }
      await todoService.createTodo(payload);
      this.invalidateCache();
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to add the todo";
      });
    }
  }

  _applyPageData({ todos, total, page, next_link, prev_link }) {
    console.log("applying page data", {
      todos,
      total,
      page,
      next_link,
      prev_link,
    });
    this.todos = Array.isArray(todos) ? todos : [];
    this.total = Number(total) || 0;
    this.page = Number(page) || 1;
    this.nextLink = next_link || null;
    this.prevLink = prev_link || null;
  }
}

export const todoStore = new TodoStore();
