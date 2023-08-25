import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { IonicVue } from "@ionic/vue";
import { SplashScreen } from "@capacitor/splash-screen";

import "@/theme/app.css";
import { setupStore } from "@/store";
import addComponent from "@/boot/components";
import setCustom from "@/boot/customComponents";
import antd from "@/boot/antd";
import { userRole } from "@/utils/supabase";

const app = createApp(App).use(IonicVue).use(router);
addComponent(app);
setCustom(app);
antd(app);
setupStore(app);
const filterOption = (input, option) => {
  const haystack = option.label.toString();
  const needle = input.toString();
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

app.config.globalProperties.$userRole = userRole;
app.config.globalProperties.$filterOption = filterOption;
SplashScreen.show({
  showDuration: 3000,
  autoHide: true,
});
router.isReady().then(async () => {
  app.mount("#app");
});




