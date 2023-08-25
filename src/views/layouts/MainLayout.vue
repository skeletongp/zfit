<template>
  <ion-page>
    <MenuBar />
  </ion-page>
</template>

<script setup>
import MenuBar from "@/components/MenuBar.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
</script>
