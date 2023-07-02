<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" style="--width: 70%" ref="menuController">
        <ion-header>
          <ion-toolbar>
            <ion-nav-link
              :router-link="`/pages/profile`"
              class="w-full h-24 overflow-hidden relative border-transparent card-bg"
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
              <ion-nav-link :router-link="r.path" v-if="$userRole(r.role)">
                <ion-menu-toggle :auto-hide="false">
                  <ion-item lines="none" :detail="false" class="hydrated">
                    <svg-icon :path="r.icon" fill="rgb(255, 224, 36, .5)" />
                    <ion-label class="pl-4">{{ r.title }}</ion-label>
                  </ion-item>
                </ion-menu-toggle>
              </ion-nav-link>
            </template>
          </ion-list>
          <ion-list id="inbox-list">
            <ion-nav-link
              :router-link="r2.path"
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
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title slot="end">
              <ion-label>{{ useGeneralStore().getTitle || "Zaitama Fitness" }}</ion-label>
            </ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-router-outlet :key="$route.fullPath" />
        </ion-content>
      </ion-page>
    </ion-split-pane>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { onIonViewDidEnter } from "@ionic/vue";
import "@/theme/menu.css";
import { routes, routes2 } from "@/vars/menuRoutes";
import { logOutOutline } from "ionicons/icons";
import { supabase, userRole } from "@/utils/supabase";
import { useRouter } from "vue-router";
import { useUserStore, useGeneralStore } from "@/store";

const userStore = useUserStore();
var user = reactive({});
const router = useRouter();
const menuController = ref(null);

const logOut = async () => {
  await supabase.auth.signOut();
  router.push({ name: "auth" });
};

const checkRole = async (role) => {
  return userRole(role);
};

onIonViewDidEnter(() => {
  console.log(menuController.value);
  menuController.value.close;
});
onMounted(async () => {
  user = userStore.getUser || {};
});
</script>
e
