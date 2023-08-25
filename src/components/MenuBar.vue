<template>
  <ion-page class="max-w-lg mx-auto" :key="key">
    <ion-split-pane content-id="main-content" :when="false">
      <ion-menu
        content-id="main-content"
        type="overlay"
        style="--width: 70%"
        ref="menuController"
      >
        <ion-header>
          <ion-toolbar>
            <ion-nav-link
              :router-link="`/pages/profile`"
              class="w-full h-24 overflow-hidden relative border-transparent card-bg cursor-pointer"
            >
              <div class="grid grid-cols-4 h-full items-center">
                <div class="col-span-1">
                  <ion-avatar
                    class="mx-auto rounded-full border-2 border-white !w-12 !h-12"
                  >
                    <a-image :src="user.photo" class="rounded-full !w-12 !h-12" />
                  </ion-avatar>
                </div>

                <div class="flex flex-col justify-center col-span-3 py-2 pl-2">
                  <h1 class="font-bold text-white uppercase w-full ellipsis">
                    {{ user.name }}
                  </h1>
                  <h3 class="text-white text-sm w-full ellipsis">
                    {{ user.email }}
                  </h3>
                </div>
              </div>
              <!-- Actions -->
            </ion-nav-link>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list id="inbox-list">
            <template v-for="(r, i) in routes" :key="i + 'menu'">
              <ion-nav-link
                class="cursor-pointer"
                router-direction="forward"
                :router-link="`/pages/${r.path}`"
                v-if="$userRole(r.role)"
              >
                <ion-menu-toggle :auto-hide="false">
                  <ion-item lines="none" :detail="false" class="hydrated">
                    <svg-icon :path="r.icon" fill="rgb(255, 224, 36, .5)" />
                    <ion-label class="pl-4 text-contrast">{{ r.title }}</ion-label>
                  </ion-item>
                </ion-menu-toggle>
              </ion-nav-link>
            </template>
          </ion-list>
          <ion-list id="inbox-list">
            <ion-nav-link
              class="cursor-pointer"
              :router-link="`/pages/${r2.path}`"
              router-direction="forward"
              v-for="(r2, i) in routes2"
              :key="i + 'menu2'"
            >
              <ion-menu-toggle :auto-hide="false">
                <ion-item lines="none" :detail="false" class="hydrated">
                  <svg-icon :path="r2.icon" fill="rgb(255, 224, 36, .5)" />
                  <ion-label class="pl-4">{{ r2.title }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-nav-link>
          </ion-list>
          <ion-button
            style="--color: #ffe024"
            fill="clear"
            class="absolute bottom-2"
            @click="logOut"
          >
            <ion-icon
              :icon="logOutOutline"
              class="pl-2 transform -scale-x-100"
            ></ion-icon>
            Salir
          </ion-button>
        </ion-content>
      </ion-menu>
      <ion-page id="main-content">
        <ion-header class="bg-primary pl-2">
          <ion-toolbar class="">
            <ion-buttons slot="start">
              <ion-back-button
                mode="ios"
                color="light"
                text=""
                v-if="route.name != 'home'"
                :defaultHref="'/'"
              ></ion-back-button>
              <router-link router-direction="forward" v-else to="/pages/profile">
                <ion-avatar>
                  <img :src="user.photo" class="rounded-full !w-6 !h-6" />
                </ion-avatar>
              </router-link>
            </ion-buttons>
            <ion-title class="text-center">
              <ion-label class="uppercase text-contrast font-bold text-sm">{{
                useGeneralStore().getTitle || "Zaitama Fitness"
              }}</ion-label>
            </ion-title>
            <ion-buttons slot="end">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-router-outlet :animated="true" :key="$route.fullPath" />
        </ion-content>
      </ion-page>
    </ion-split-pane>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { onIonViewDidEnter } from "@ionic/vue";
import "@/theme/menu.css";
import { routes, routes2 } from "@/vars/menuRoutes";
import { logOutOutline } from "ionicons/icons";
import { supabase } from "@/utils/supabase";
import { useRouter, useRoute } from "vue-router";
import { useUserStore, useGeneralStore } from "@/store";
import EventBus from "@/utils/eventBus";

const userStore = useUserStore();
var user = reactive({});
const router = useRouter();
const route = useRoute();
const menuController = ref(null);
const key = ref(0);
const logOut = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("zfitLoggedUser");
  router.push({ name: "auth" });
};

onIonViewDidEnter(() => {});
onMounted(async () => {
  EventBus.on("userChanged", (newUser) => {
    user = newUser || {};
    key.value = new Date().getTime();
  });
  user = userStore.getUser || {};
});

watch(
  () => route.fullPath,
  () => {
    menuController.value.close;
    const back = window.history.state.back;
    const current = window.history.state.current;
  },
  { deep: true }
);
</script>
e
