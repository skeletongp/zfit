import * as icon from "@mdi/js";
const routes = [
  {
    name: "home",
    title: "Inicio",
    path: "/",
    icon: icon.mdiHomeOutline,
    role: ["user", "admin", "client"],
  },
  {
    name: "routines",
    title: "Rutinas",
    path: "/pages/routines",
    icon: icon.mdiDumbbell,
    role: ["user", "admin", "client"],
  },
  {
    name: "food",
    title: "Dieta",
    path: "/pages/food",
    icon: icon.mdiFoodOutline,
    role: ["admin", "client"],
  },
  {
    name: "gallery",
    title: "Galería",
    path: "/pages/gallery",
    icon: icon.mdiMultimedia,
    role: ["user", "admin", "client"],
  },
  {
    name: "appointments",
    title: "Planes",
    path: "/pages/appointments",
    icon: icon.mdiCalendarClockOutline,
    role: ["admin", "client"],
  },
  {
    name: "chat",
    title: "Mensajes",
    path: "/pages/chat",
    icon: icon.mdiChatOutline,
    role:['admin','client']
  },
  {
    name:'users',
    title:'Usuarios',
    path:'path/users',
    icon:icon.mdiAccountMultipleOutline,
    role:['admin']
  },
  {
    name:'finance',
    title:'Finanzas',
    path:'path/finance',
    icon:icon.mdiCash,
    role:['admin']
  },
  
];

const routes2 = [
  {
    name: "profile",
    title: "Perfil",
    path: "/pages/profile",
    icon: icon.mdiAccountOutline,
  },
  {
    name: "settings",
    title: "Ajustes",
    path: "/pages/settings",
    icon: icon.mdiCogStopOutline,
  },
];

export { routes, routes2 };
