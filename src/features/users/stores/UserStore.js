import { makeAutoObservable, configure, runInAction } from "mobx";
import { userService } from "../services/userService";

configure({ enforceActions: "always" });

export class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchUser() {
    const user = await userService.getCurrentUser();
    this.user = user;
  }

  async updatePassword(passwordData) {
    const user = await userService.updatePassword(passwordData);
    this.user = user;
  }

  logout() {
    userService.logout();
  }

  async updateUser(userData) {
    const user = await userService.updateUser(userData);
    this.user = user;
  }

  async deleteUser() {
    await userService.deleteUser();
  }

  async createUser(userData) {
    const user = await userService.createUser(userData);
    this.user = user;
  }
}

export const userStore = new UserStore();
