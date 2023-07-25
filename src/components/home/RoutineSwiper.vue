<template>
  <swiper-body
    v-if="routines.length > 0"
    :effect="'creative'"
    :grabCursor="true"
    :centeredSlides="true"
    :loop="true"
    :creativeEffect="{
      prev: {
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    }"
    :autoplay="{
      delay: 3500,
      disableOnInteraction: false,
    }"
    :modules="modules"
  >
    <swiper-slide v-for="(routine, index) in routines" :key="index + 'routine'">
      <RoutineCard :routine="routine" />
    </swiper-slide>
  </swiper-body>
  <empty-card v-else />
</template>
<script setup>
import { routines } from "@/vars/fakeData";
import { Autoplay, EffectCreative } from "swiper";
import RoutineCard from "@/components/routines/RoutineCard.vue";
const modules = [Autoplay, EffectCreative];
import * as icon from "ionicons/icons";
</script>
