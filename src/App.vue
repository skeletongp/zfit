<template>
  <ion-app>
    <ion-nav :root="component"></ion-nav>
    <ion-router-outlet :animated="true" />
  </ion-app>
</template>

<script setup>
import { useBackButton } from "@ionic/vue";
import { App } from "@capacitor/app";
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import supabase from "@/utils/supabase";
import HomePage from "@/views/pages/HomePage.vue";
const component = HomePage;
var pressed = 0;
useBackButton(10, () => {
  pressed++;
  if (pressed == 1) {
    message.warning("Presione nuevamente para salir");
    setTimeout(() => {
      pressed = 0;
    }, 2000);
  } else {
    App.exitApp();
  }
  return;
});

onMounted(async () => {});
</script>
