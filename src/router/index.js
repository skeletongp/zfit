import { createRouter, createWebHistory } from "@ionic/vue-router";
import { supabase } from "@/utils/supabase";
import { useGeneralStore } from "@/store";
import routes from "@/router/routes";
const checkAuth = async (to, from, next) => {
  const generalStore = useGeneralStore();
  generalStore.setTitle(to.meta?.title);
  var user = null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  user = session?.user;
  if (to.meta.requiresAuth && !user) {
    next({ name: "auth" });
    return;
  }
  if (to.name == "auth" && user) {
    next({ name: "home" });
    return;
  } else {
    next();
    return;
  }
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuth);

export default router;
