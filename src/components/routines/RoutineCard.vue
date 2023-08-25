<template>
  <div
    class="h-52 w-full bg-primary bg-center bg-cover bg-no-repeat rounded-xl relative overflow-hidden border-2"
    :style="{ backgroundImage: `url(${routine.image})` }"
  >
    <div
      class="absolute top-0 right-0 left-0 h-8 bg-primary bg-opacity-75 flex items-center px-2"
    >
      <router-link
        :to="'/pages/routines/' + routine.id"
        class="w-full ellipsis text-contrast font-bold uppercase text-lg"
      >
        {{ routine.name }}
      </router-link>
    </div>
    <div
      class="h-full w-full py-10 px-2 grid grid-cols-4 items-center bg-primary bg-opacity-80"
    >
      <ion-avatar class="col-span-1 rounded-full border-2 border-white !w-16 !h-16">
        <a-image :src="routine.image" class="rounded-full !w-16 !h-16" />
      </ion-avatar>
      <p
        class="line-clamp-4 text-md leading-5 col-span-3"
        v-html="routine.description"
      ></p>
    </div>
    <div
      class="absolute bottom-0 right-0 left-0 h-8 bg-primary justify-evenly bg-opacity-75 flex items-center px-2"
    >
      <div class="flex items-center space-x-2">
        <ion-icon :icon="icon.alarmOutline" class="text-white text-lg"></ion-icon>
        <span>{{ routine.duration }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <ion-icon :icon="icon.bodyOutline" class="text-white text-lg"></ion-icon>
        <span>{{ routine.body }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span>{{ routine.range }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as icon from "ionicons/icons";
const props = defineProps({
  routine: {
    type: Object,
    required: true,
  },
});
</script>
