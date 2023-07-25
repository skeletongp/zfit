<template>
  <ion-list class="px-4" v-if="loading">
    <ion-list-header>
      <ion-skeleton-text
        :animated="true"
        style="width: 100%; height: 20px"
      ></ion-skeleton-text>
    </ion-list-header>
    <ion-item>
      <ion-thumbnail slot="start" style="--border-radius: 50%; --size: 5rem">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
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

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});
</script>
