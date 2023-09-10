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
    <ion-content class="">
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        v-if="userRole(['admin', 'trainer'])"
      >
        <router-link to="/pages/routines/new">
          <ion-fab-button>
            <ion-icon :icon="add" />
          </ion-fab-button>
        </router-link>
      </ion-fab>
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
import { onMounted } from "vue";
import { useRoutines } from "@/utils/routines";
import RoutineCard from "@/components/routines/RoutineCard.vue";
import { add } from "ionicons/icons";
import { userRole } from "@/utils/supabase";

const { routines, getRoutines, params, onSearch } = useRoutines();

const onPaginate = async (ev) => {
  params.page = params.page + 1;
  await getRoutines();
  setTimeout(() => ev.target.complete(), 500);
};
onMounted(async () => {
  params.page = 1;
  params.order = "id";
  params.ascend = false;
  await getRoutines();
});
</script>
