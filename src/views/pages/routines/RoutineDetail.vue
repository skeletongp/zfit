<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        v-if="$userRole(['admin', 'trainer'])"
      >
        <router-link to="/pages/routines/new">
          <ion-fab-button>
            <ion-icon :icon="add" />
          </ion-fab-button>
        </router-link>
      </ion-fab>
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="start"
        v-if="!$userRole(['user'])"
      >
        <ion-fab-button @click="toggleFavorite">
          <ion-icon :icon="isFavorite ? bookmark : bookmarkOutline" />
        </ion-fab-button>
      </ion-fab>
      <div v-if="routine" class="pb-12">
        <RoutineInfo :routine="routine" />
      </div>
      <empty-card v-else :duration="5000" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { onIonViewDidEnter } from "@ionic/vue";
import { useRoutines } from "@/utils/routines";
import { useFavorites, useSetFavorite } from "@/utils/favorites";
import { useRoute } from "vue-router";
import { add, bookmarkOutline, bookmark } from "ionicons/icons";
import RoutineInfo from "@/components/routines/RoutineInfo.vue";
const user = JSON.parse(localStorage.getItem("zfitLoggedUser"));

const { checkIsFavorite } = useFavorites(user.id);
const { favorite, saveFavorite, removeFavorite } = useSetFavorite(user.id);
const { routine, findRoutine } = useRoutines();

const route = useRoute();

const isFavorite = ref(false);

const toggleFavorite = async () => {
  if (isFavorite.value) {
    await removeFavorite(isFavorite.value);
    isFavorite.value = null;
  } else {
    await setFavorite();
  }
};

const setFavorite = async () => {
  favorite.title = routine.value.name;
  favorite.fave_id = routine.value.id;
  favorite.fave_type = "routines";
  favorite.image = routine.value.image;
  const res = await saveFavorite();
  if (res && !res.error) {
    isFavorite.value = res.id;
  }
};

onIonViewDidEnter(async () => {
  const id = route.params.id;
  await findRoutine(id, "id");
  isFavorite.value = await checkIsFavorite(id, "routines");
});
</script>
