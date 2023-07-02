<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-no-padding">
      <div class="w-full h-full bg-primary p-4 flex flex-col">
        <!-- Primary Info -->
        <div class="w-full flex flex-col items-center">
          <ion-avatar
            class="mx-auto rounded-full border-2 my-1 border-contrast overflow-hidden !w-24 !h-24"
          >
            <a-image :src="user.photo" class="rounded-full !w-24 !h-24" />
          </ion-avatar>
          <h1 class="font-bold text-xl ellipsis w-full text-center text-white">
            {{ user.name }}
          </h1>
          <h1 class="ellipsis text-sm -mt-2 w-full text-center text-contrast opacity-80">
            {{ user.email }}
          </h1>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 items-center gap-1 mt-4">
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <span class="text-xl font-bold text-white"> 13.5 Hrs.</span>
            <span class="text-sm font-bold text-white"> Este Mes </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <div class="h-6 w-[0.75px] bg-gray-200 absolute left-0 top-[37.5%]"></div>
            <div class="h-6 w-[0.75px] bg-gray-200 absolute right-0 top-[37.5%]"></div>
            <span class="text-xl font-bold text-white"> 8.3 Kgs.</span>
            <span class="text-sm font-bold text-white"> Aumentados </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <span class="text-xl font-bold text-white"> 25.3 IMC</span>
            <span class="text-sm font-bold text-white"> Normal </span>
          </div>
        </div>
        <hr class="border-contrast mb-4" />
        <!-- Segments -->
        <ion-segment v-model="viewOpen" :scrollable="true">
          <ion-segment-button value="body" :class="{ active: isActive('body') }">
            <ion-icon :icon="icon.bodyOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="socials" :class="{ active: isActive('socials') }">
            <ion-icon :icon="icon.linkOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="evals" :class="{ active: isActive('evals') }">
            <ion-icon :icon="icon.scaleOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="saved" :class="{ active: isActive('saved') }">
            <ion-icon :icon="icon.bookmarkOutline"></ion-icon>
          </ion-segment-button>
        </ion-segment>

        <!-- Body -->
        <div v-if="viewOpen == 'body'">
          <BodyComponent />
        </div>
        <!-- Socials -->
        <div v-else-if="viewOpen == 'socials'">
          <SocialComponent />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore, useGeneralStore } from "@/store";
import BodyComponent from "@/components/profile/BodyComponent.vue";
import SocialComponent from "@/components/profile/SocialComponent.vue";
import * as icon from "ionicons/icons";
const userStore = useUserStore();

var user = reactive({});
const viewOpen = ref("body");

const isActive = (view) => {
  return viewOpen.value === view;
};
onMounted(async () => {
  user = userStore.getUser || {};
});
</script>

<style scoped>
.active {
  @apply text-contrast opacity-75;
}
</style>
