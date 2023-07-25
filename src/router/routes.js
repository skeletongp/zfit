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
  
        /* Usuarios */
        {
          path: "users",
          name: "users",
          component: () => import("@/views/pages/users/UsersPage.vue"),
          meta: {
            requiresAuth: true,
            requireRole:'admin',
            title: "Usuarios",
          },
        },
        {
          path: "users/:id",
          name: "users_show",
          component: () => import("@/views/pages/users/UserShow.vue"),
          meta: {
            requiresAuth: true,
            requireRole:'admin',
            title: "Detalle de Usuario",
          },
        },
        {
            path: "routines/",
            name: "routines",
            component: () => import("@/views/pages/routines/RoutinePage.vue"),
            meta: {
              requiresAuth: true,
              title: "Rutinas y Consejos",
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

  export default routes;