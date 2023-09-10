<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-no-padding">
      <div class="w-full h-full bg-primary p-4 flex flex-col" :key="key">
        <!-- Primary Info -->
        <div class="w-full flex flex-col items-center relative">
          <div class="absolute bottom-1 right-1">
            <photo-chooser :prevPhoto="user.photo" @onPhoto="editPhotoUser">
              <ion-icon :icon="icon.cameraOutline" class="text-xl hover:text-contrast" />
            </photo-chooser>
          </div>
          <div class="absolute bottom-1 left-1">
            <PasswordChange />
          </div>
          <ion-avatar
            class="mx-auto rounded-full border-2 my-1 border-contrast overflow-hidden !w-20 !h-20"
          >
            <a-image
              :src="user.photo || 'src/assets/no-photo.png'"
              class="rounded-full !w-20 !h-20"
            />
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
            <span class="text-xl font-bold text-white"> {{ user.height || 0 }} Cm.</span>
            <span class="text-sm font-bold text-white"> Estatura </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <div class="h-6 w-[0.75px] bg-gray-200 absolute left-0 top-[37.5%]"></div>
            <div class="h-6 w-[0.75px] bg-gray-200 absolute right-0 top-[37.5%]"></div>
            <span class="text-xl font-bold text-white"> {{ user.weight || 0 }} Kgs.</span>
            <span class="text-sm font-bold text-white"> Peso </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <span class="text-xl font-bold text-white"> {{ user.imc || 0 }} IMC</span>
            <span class="text-sm font-bold text-white"> {{ imcStatus(user.imc) }} </span>
          </div>
        </div>
        <hr class="border-contrast mb-1" />
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
          <ion-segment-button value="edit" :class="{ active: isActive('edit') }">
            <ion-icon :icon="icon.optionsOutline"></ion-icon>
          </ion-segment-button>
        </ion-segment>

        <!-- Body -->
        <div v-if="viewOpen == 'body'">
          <BodyComponent :user="user" />
        </div>
        <!-- Socials -->
        <div v-else-if="viewOpen == 'socials'">
          <SocialComponent :user="user" :isMyProfile="true" />
        </div>
        <!-- Evals -->
        <div v-else-if="viewOpen == 'evals'">
          <UserEvals :user="user" :isMyProfile="true" />
        </div>
        <!-- Saved -->
        <div v-else-if="viewOpen == 'saved'" class="w-full">
          <SavedItems />
        </div>
        <!-- Edit -->
        <div v-else-if="viewOpen == 'edit'" class="w-full">
          <EditUser :prev-user="user" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useUserStore } from "@/store";
import BodyComponent from "@/components/profile/BodyComponent.vue";
import SocialComponent from "@/components/profile/SocialComponent.vue";
import UserEvals from "@/components/profile/UserEvals.vue";
import EditUser from "@/components/profile/EditUser.vue";
import SavedItems from "@/components/profile/SavedItems.vue";
import PasswordChange from "@/components/profile/PasswordChange.vue";

import * as icon from "ionicons/icons";
import { useUsers, useEditUser } from "@/utils/users";
const { updatePhoto, loadUser } = useEditUser();
const viewOpen = ref(null);
const key = ref(0);
const { params, user, findUser, getWeight, imcStatus } = useUsers();

const isActive = (view) => {
  return viewOpen.value === view;
};

const getUser = async () => {
  const userStore = useUserStore();
  const id = userStore.getUser.id;
  params.cols = "*, contacts(*)";
  await findUser(id, "id");
  await getWeight(id);
};

const editPhotoUser = async (photo) => {
  await loadUser(user.value);
  await updatePhoto(photo);
  await getUser();
};

onBeforeMount(async () => {
  await getUser();
  viewOpen.value = "body";

  key.value = new Date().getTime();
});

watch(
  () => viewOpen.value,
  async () => {
    await getUser();
  },
  {
    deep: true,
  }
);
</script>

<style scoped>
.active {
  @apply text-contrast opacity-75;
}
</style>
