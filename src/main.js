import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { IonicVue } from "@ionic/vue";
import { useUserStore, useGeneralStore } from "@/store";
import { supabase } from "@/utils/supabase";

import "@/theme/app.css";
import { setupStore } from "@/store";
import addComponent from "@/boot/components";
import antd from "@/boot/antd";
import { userRole } from "@/utils/supabase";

const app = createApp(App).use(IonicVue).use(router);
addComponent(app);
antd(app);
setupStore(app);
const filterOption = (input, option) => {
  const haystack = option.label.toString();
  const needle = input.toString();
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

app.config.globalProperties.$userRole = userRole;
app.config.globalProperties.$filterOption = filterOption;
router.isReady().then(async() => {
  await getUser();
  app.mount("#app");
});

const getUser = async () => {
  const user = {};
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session.user)
  const userStore = useUserStore();
  if (session?.user) {
    user.id = session.user.id;
    user.email = session.user.email;
    const profile = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    user.address = profile.data?.address;
    user.name = profile.data?.name;
    user.birthdate = profile.data?.birthdate;
    user.photo = profile.data?.photo || "src/assets/no-photo.png";
    user.price = profile.data?.price || 0;
    user.start_date = profile.data?.start_date;
    user.height = profile.data?.height;
    user.role=profile.data?.role||'user';
    userStore.setUser(user);
  }
};
