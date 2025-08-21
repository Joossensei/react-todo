import { makeAutoObservable, configure, runInAction } from "mobx";
import { priorityService } from "../services/priorityService";
import { userService } from "../../users/services/userService";

configure({ enforceActions: "always" });

export class PriorityStore {
  priorities = [];

  page = 1;
  size = 10;
  nextLink = null;
  prevLink = null;

  loading = false;
  error = null;

  cache = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get visiblePriorities() {
    return this.priorities;
  }

  get totalPages() {
    return Math.max(1, Math.ceil((Number(this.total) || 0) / this.size));
  }

  async fetchPage(targetPage = 1, force = false) {
    console.log("fetching page", targetPage);
    try {
      this.loading = true;
      this.error = null;
      const cacheKey = `priorities|p=${targetPage}`;
      if (this.cache.has(cacheKey) && !force) {
        const data = this.cache.get(cacheKey);
        this._applyPageData(data);
      } else {
        const data = await priorityService.getPrioritiesPaged({
          page: targetPage,
          size: this.size,
        });
        runInAction(() => {
          this.cache.set(cacheKey, data);
          this._applyPageData(data);
        });
      }
    } catch (err) {
      runInAction(() => {
        this.error = err?.message || "Failed to load priorities";
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
      const data = await priorityService.getPrioritiesByLink(this.nextLink);
      const parsed = new URL(this.nextLink, window.location.origin);
      const nextPage = Number(parsed.searchParams.get("page")) || this.page + 1;
      const cacheKey = `priorities|p=${nextPage}`;
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
      const data = await priorityService.getPrioritiesByLink(this.prevLink);
      const parsed = new URL(this.prevLink, window.location.origin);
      const prevPage =
        Number(parsed.searchParams.get("page")) || Math.max(1, this.page - 1);
      const cacheKey = `priorities|p=${prevPage}`;
      runInAction(() => {
        if (!this.cache.has(cacheKey)) {
          this.cache.set(cacheKey, data);
        }
      });
    } catch (_e) {}
  }

  goToNext() {
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

  async deletePriority(key) {
    try {
      this.error = null;
      await priorityService.deletePriority(key);
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to delete the todo";
      });
    }
  }

  async updatePriority(key, priorityData) {
    try {
      this.error = null;
      await priorityService.updatePriority(key, priorityData);
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to update priority";
      });
    }
  }

  async patchPriority(key, priorityData) {
    try {
      this.error = null;
      await priorityService.patchPriority(key, priorityData);
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to patch priority";
      });
    }
  }

  async reorderPriorities(key, { fromOrder, toOrder }) {
    try {
      this.error = null;
      await priorityService.reorderPriorities(key, { fromOrder, toOrder });
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to reorder priorities";
      });
    }
  }

  async createPriority(priorityData) {
    try {
      this.error = null;
      await priorityService.createPriority(priorityData);
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to create priority";
      });
    }
  }

  async editPriority(key, { title, priority, description }) {
    try {
      this.error = null;
      const current = this.priorities.find((t) => t.key === key);
      if (!current) return;
      await priorityService.patchPriority(key, {
        title: title ?? current.title,
        priority: priority ?? current.priority,
        completed: current.completed,
        description: description ?? current.description,
      });
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to save changes";
      });
    }
  }

  async addPriority({ title, priority, description = "" }) {
    try {
      this.error = null;
      const user_key = userService.getUserKey();
      const payload = {
        title: String(title || "").trim(),
        priority,
        description,
        completed: false,
        user_key,
      };
      if (!payload.title || !payload.priority) {
        throw new Error("Todo and priority are required");
      }
      await priorityService.createPriority(payload);
      await this.refetch(true);
    } catch (e) {
      runInAction(() => {
        this.error = e?.message || "Failed to add the todo";
      });
    }
  }

  _applyPageData({ priorities, total, page, next_link, prev_link }) {
    this.priorities = Array.isArray(priorities) ? priorities : [];
    this.total = Number(total) || 0;
    this.page = Number(page) || 1;
    this.nextLink = next_link || null;
    this.prevLink = prev_link || null;
  }
}

export const priorityStore = new PriorityStore();
