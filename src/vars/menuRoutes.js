import * as icon from "@mdi/js";
const routes = [
  {
    name: "home",
    title: "Inicio",
    path: "home",
    icon: icon.mdiHomeOutline,
    role: ["user", "admin", "client", "trainer"],
  },
  {
    name: "routines",
    title: "Rutinas",
    path: "routines",
    icon: icon.mdiDumbbell,
    role: ["user", "admin", "client", "trainer"],
  },
  {
    name: "foods",
    title: "Alimentos",
    path: "foods",
    icon: icon.mdiFoodOutline,
    role: ["admin", "client", "trainer", "user"],
  },
  {
    name: "gallery",
    title: "Galería",
    path: "gallery",
    icon: icon.mdiMultimedia,
    role: ["user", "admin", "client", "trainer"],
  },
  {
    name: "appointments",
    title: "Agenda",
    path: "appointments",
    icon: icon.mdiCalendarClockOutline,
    role: ["admin", "client", "trainer"],
  },
  {
    name: "chat",
    title: "Mensajes",
    path: "chat",
    icon: icon.mdiChatOutline,
    role: ["admin", "client", "trainer"],
  },
  {
    name: "users",
    title: "Usuarios",
    path: "users",
    icon: icon.mdiAccountMultipleOutline,
    role: ["admin", "trainer"],
  },
  {
    name: "trainers",
    title: "Coachs",
    path: "trainers",
    icon: icon.mdiAccountMultipleOutline,
    role: ["admin", "user"],
  },
  {
    name: "finance",
    title: "Finanzas",
    path: "pages/finance",
    icon: icon.mdiCash,
    role: ["admin", "trainer"],
  },
];

const routes2 = [
  {
    name: "profile",
    title: "Perfil",
    path: "profile",
    icon: icon.mdiAccountOutline,
  },
  {
    name: "settings",
    title: "Ajustes",
    path: "settings",
    icon: icon.mdiCogStopOutline,
  },
];

export { routes, routes2 };
