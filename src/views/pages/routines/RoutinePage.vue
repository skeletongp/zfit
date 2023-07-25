<template>
  <ion-page>
    <ion-header class="bg-primary ion-padding">
      <ion-toolbar>
        <ion-searchbar
          v-model="params.search"
          @ionInput="onSearch"
          :debounce="300"
          placeholder="Buscar"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list v-if="routines.length > 0">
        <ion-item v-for="routine in routines" :key="routines.id" class="my-2">
          <RoutineCard :routine="routine" />
        </ion-item>
        <ion-infinite-scroll v-if="routines.length > 9" @ionInfinite="onPaginate">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-list>
      <empty-card v-else />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onIonViewDidEnter } from "@ionic/vue";
import { useRoutines } from "@/utils/routines";
import RoutineCard from "@/components/routines/RoutineCard.vue";

const { routines, getRoutines, params, onSearch } = useRoutines();

const onPaginate = async (ev) => {
  params.page = params.page + 1;
  await getRoutines();
  setTimeout(() => ev.target.complete(), 500);
};
onIonViewDidEnter(async () => {
  params.paginate = true;
  params.order = "id";
  params.ascend = false;
  await getRoutines();
});
</script>
