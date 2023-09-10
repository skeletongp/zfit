import { createApp } from "vue";
import addComponent from "../../../src/boot/components";
import antd from "../../../src/boot/antd";
import setCustom from "../../../src/boot/customComponents";
import { userRole } from "@/utils/supabase";
import { setupStore } from "../../../src/store/index";
import { shallowMount } from "@vue/test-utils";
import { RouterLink } from "vue-router";

const filterOption = (input, option) => {
  const haystack = option.label.toString();
  const needle = input.toString();
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

export function setup() {
  const app = createApp({});
  addComponent(app);
  antd(app);
  setCustom(app);
  setupStore(app);
  app.config.globalProperties.$userRole = userRole;
  app.config.globalProperties.$filterOption = filterOption;
  return app;
}
const mountApp = (component) => {
  const app = setup(); // Configura el entorno de prueba
  const wrapper = shallowMount(component, {
    global: {
      plugins: [app],
      components: [RouterLink]
    },
    stubs: ["router-link"],
  
  });

  return wrapper;
};

export default mountApp;
