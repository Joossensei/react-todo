import { makeAutoObservable, configure, runInAction } from "mobx";
import { userService } from "../services/userService";

configure({ enforceActions: "always" });

export class UserStore {
  user = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchUser() {
    this.loading = true;
    this.error = null;
    try {
      const user = await userService.getCurrentUser();
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to fetch user";
        this.loading = false;
      });
    }
  }

  async updatePassword(passwordData) {
    this.loading = true;
    this.error = null;
    try {
      const user = await userService.updatePassword(passwordData);
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to update password";
        this.loading = false;
      });
      throw e;
    }
  }

  logout() {
    userService.logout();
    runInAction(() => {
      this.user = null;
    });
  }

  async login(loginData) {
    this.loading = true;
    this.error = null;
    try {
      const user = await userService.login(loginData);
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to login";
        this.loading = false;
      });
      throw e;
    }
  }

  async updateUser(userData) {
    this.loading = true;
    this.error = null;
    try {
      const user = await userService.updateUser(userData);
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to update user";
        this.loading = false;
      });
      throw e;
    }
  }

  async deleteUser() {
    this.loading = true;
    this.error = null;
    try {
      await userService.deleteUser();
      runInAction(() => {
        this.user = null;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to delete user";
        this.loading = false;
      });
      throw e;
    }
  }

  async createUser(userData) {
    this.loading = true;
    this.error = null;
    try {
      const user = await userService.createUser(userData);
      runInAction(() => {
        this.user = user;
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e?.response?.data?.detail || e?.message || "Failed to create user";
        this.loading = false;
      });
      throw e;
    }
  }
}

export const userStore = new UserStore();
