<template>
  <ion-list class="px-4 w-full" v-if="loading">
    <div v-for="n in 8" :key="n" class="w-full flex pt-3 my-4 relative ion-no-padding">
      <div class="!w-full grid grid-cols-3 gap-x-4 pt-4">
        <p class="col-span-3">
          <ion-skeleton-text :animated="true" style="width: 100%; height: 15px" />
        </p>
        <p class="col-span-1">
          <ion-skeleton-text :animated="true" style="width: 99%; height: 15px" />
        </p>
        <p class="col-span-1">
          <ion-skeleton-text :animated="true" style="width: 99%; height: 15px" />
        </p>
        <p class="col-span-1">
          <ion-skeleton-text :animated="true" style="width: 99%; height: 15px" />
        </p>
        <p class="absolute -top-1 right-0 ellipsis w-6">
          <ion-skeleton-text style="width: 99%; height: 15px" />
        </p>
      </div>
    </div>
  </ion-list>
  <div
    v-else
    class="h-[20rem] w-full flex flex-col space-y-2 justify-center items-center"
  >
    <img src="@/assets/not_found.png" alt="Empty" class="h-[12rem]" />
    <div class="text-xl tb:text-2xl font-bold text-gray-300">SIN RESULTADOS</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const loading = ref(true);
const props = defineProps({
  duration: {
    type: Number,
    default: 3500,
  },
});
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, props.duration);
});
</script>
