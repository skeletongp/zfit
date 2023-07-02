import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    getUser() {
      return this.user;
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
});
