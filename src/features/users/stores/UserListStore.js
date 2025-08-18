import { makeAutoObservable, configure, runInAction } from "mobx";
import { userService } from "../services/userService";

configure({ enforceActions: "always" });

export class UserListStore {
  users = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;
    try {
      const users = await userService.getUsers();
      runInAction(() => {
        this.users = users;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to fetch users";
        this.loading = false;
      });
    }
  }
}

export const userListStore = new UserListStore();
