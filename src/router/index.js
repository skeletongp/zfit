import { createRouter, createWebHistory } from "@ionic/vue-router";
import { supabase } from "@/utils/supabase";
import { useGeneralStore } from "@/store";
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
const routes = [
  {
    path: "",
    redirect: "/pages/home",
  },
  {
    path: "/pages",
    component: () => import("@/views/layouts/MainLayout.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/pages/HomePage.vue"),
        meta: {
          requiresAuth: true,
          title: "Inicio",
        },
      },

      /* Profile */
      {
        path: "profile",
        name: "profile",
        component: () => import("@/views/pages/profile/ProfilePage.vue"),
        meta: {
          requiresAuth: true,
          title: "Perfil",
        },
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("@/views/layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        name: "auth",
        component: () => import("@/views/pages/auth/AuthPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuth);

export default router;
