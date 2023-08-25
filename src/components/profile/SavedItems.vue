<template>
  <h1 class="my-4 font-bold uppercase text-gray-300 text-lg">Favoritos</h1>
  <ion-list class="grid grid-cols-2 gap-4" v-if="favorites.length > 0">
    <router-link
      class="p-2 pb-0 relative rounded-xl shadow-md shadow-gray-500 overflow-hidden"
      v-for="favorite in favorites"
      :key="favorite.id"
      :to="`/pages/${favorite.fave_type}/${favorite.fave_id}`"
    >
      <div
        class="h-[7.5rem] w-[7.5rem] rounded-full mx-auto mt-1 bg-center bg-cover"
        :style="{ backgroundImage: `url(${favorite.image})` }"
      />
      <span class="absolute -left-1 bottom-1/2 text-gray-500 transform -rotate-90">
        {{ getType()[favorite.fave_type] }}
      </span>
      <div class="h-12 flex items-center w-full">
        <h1 class="w-full w-full-line-clamp-2 text-center">{{ favorite.title }}</h1>
      </div>
    </router-link>
  </ion-list>
  <empty-card v-else />
</template>

<script setup>
import { onMounted } from "vue";
import { useFavorites } from "@/utils/favorites";
import * as icon from "ionicons/icons";
const user = JSON.parse(localStorage.getItem("zfitLoggedUser"));
console.log(user);
const { favorites, getFavorites } = useFavorites(user.id);

const getType = () => {
  return {
    routines: "Rutina",
    diets: "Dieta",
  };
};

onMounted(async () => {
  await getFavorites();
});
</script>
