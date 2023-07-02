import { defineStore } from "pinia";
export const useGeneralStore = defineStore("general", {
  state: () => ({
    title: null,
  }),
  getters: {
    getTitle() {
      return this.title;
    },
  },
  actions: {
    setTitle(title) {
      this.title = title;
    },
  },
});
