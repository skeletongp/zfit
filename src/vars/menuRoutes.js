import * as icon from "@mdi/js";
const routes = [
  {
    name: "home",
    title: "Inicio",
    path: "home",
    icon: icon.mdiHomeOutline,
    role: ["user", "admin", "client"],
  },
  {
    name: "routines",
    title: "Rutinas",
    path: "routines",
    icon: icon.mdiDumbbell,
    role: ["user", "admin", "client"],
  },
  {
    name: "food",
    title: "Dieta",
    path: "food",
    icon: icon.mdiFoodOutline,
    role: ["admin", "client"],
  },
  {
    name: "gallery",
    title: "Galería",
    path: "gallery",
    icon: icon.mdiMultimedia,
    role: ["user", "admin", "client"],
  },
  {
    name: "appointments",
    title: "Planes",
    path: "appointments",
    icon: icon.mdiCalendarClockOutline,
    role: ["admin", "client"],
  },
  {
    name: "chat",
    title: "Mensajes",
    path: "chat",
    icon: icon.mdiChatOutline,
    role:['admin','client']
  },
  {
    name:'users',
    title:'Usuarios',
    path:'users',
    icon:icon.mdiAccountMultipleOutline,
    role:['admin']
  },
  {
    name:'finance',
    title:'Finanzas',
    path:'pages/finance',
    icon:icon.mdiCash,
    role:['admin']
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
