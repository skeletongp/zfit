<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="py-4 w-full text-center">
        <router-link class="uppercase text-xl font-bold" to="/pages/routines"
          >Rutinas
        </router-link>
      </div>
      <RoutineSwiper />
    </ion-content>
  </ion-page>
</template>

<script setup>
import RoutineSwiper from "@/components/home/RoutineSwiper.vue";
</script>
