import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  getters: {
    getUser() {
      return JSON.parse(localStorage.getItem('zfitLoggedUser'));
    },
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
});
