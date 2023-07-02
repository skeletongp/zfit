import { createPinia } from 'pinia';
import { useGeneralStore } from './generalStore';
import { useUserStore } from './userStore';

export const setupStore = (app) => {
  const pinia = createPinia();
  app.use(pinia);
    
};

export { useGeneralStore, useUserStore };