<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button @click="openModal">
      <ion-icon :icon="icon.add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-modal
    :is-open="isOpen"
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent(user.id)"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro de Evaluación</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="icon.close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div
        class="w-full max-w-sm mx-auto max-h-[calc(100%-1rem)] relative overflow-y-auto"
      >
        <div class="py-4 w-full">
          <div class="grid grid-cols-6 gap-4 py-1">
            <template v-for="measure in measures" :key="measure.name">
              <div class="col-span-2">
                <ion-input
                  class="bg-transparent text-white rounded-xl"
                  type="text"
                  readonly
                  :value="measure.label"
                  placeholder="Parte"
                />
              </div>
              <div class="col-span-1">
                <ion-input
                  class="bg-transparent text-white rounded-xl"
                  type="number"
                  step="0.01"
                  v-model="measure.value"
                  placeholder="Valor"
                  :clear-on-edit="true"
                />
              </div>
            </template>
          </div>
        </div>
        <a-form
          :model="evaluation"
          @finish="saveEvaluation"
          name="addEval"
          class="w-full grid grid-cols-5 gap-2"
        >
          <a-form-item name="date" :rules="rules" class="col-span-2">
            <a-date-picker
              size="large"
              class="bg-transparent text-white rounded-xl"
              v-model:value="evaluation.date"
              placeholder="Fecha"
            />
          </a-form-item>
          <div class="col-span-3">
            <multiple-uploader @setPhotos="setPhotos" />
          </div>
          <a-form-item name="observation" :rules="rules" class="col-span-5">
            <a-textarea
              :autoSize="true"
              :showCount="true"
              :maxlength="65"
              size="large"
              class="bg-transparent text-white rounded-xl"
              type="text"
              v-model:value="evaluation.observation"
              placeholder="Nota u observación"
            />
          </a-form-item>
          <ion-button
            type="submit"
            class="font-bold col-span-5"
            color="warning"
            fill="outline"
            expand="block"
          >
            Registrar
          </ion-button>
        </a-form>
        <div class="h-40 w-full grid grid-cols-4 gap-4" v-if="photos.length > 0">
          <div
            class="w-full h-full pt-4 col-span-1 relative"
            v-for="(photo, index) in photos"
            :key="index + 'photo'"
          >
            <div class="absolute top-1 right-1 z-50">
              <ion-button class="ion-no-padding" size="small" @click="removePhoto(index)">
                <ion-icon :icon="icon.closeOutline" />
              </ion-button>
            </div>
            <a-image class="w-full h-36" :src="photo.webPath" :alt="'photo' + index" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script setup>
import { onMounted } from "vue";
import * as icon from "ionicons/icons";
import parts from "@/vars/bodyParts";
import { useNewEval } from "@/utils/evals";
import { useUserStore } from "@/store/userStore";
import { userRole } from "@/utils/supabase";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const {
  evaluation,
  rules,
  isOpen,
  openModal,
  closeModal,
  onModalDidDismiss,
  onModalDidPresent,
  setPhotos,
  saveEvaluation,
  removePhoto,
  measures,
  photos,
} = useNewEval(props.user.id);

onMounted(async () => {
  const user = useUserStore().getUser;
  if (user && userRole(["admin", "trainer"])) {
    evaluation.trainer_id = user.id;
  }
  parts.forEach((part) => {
    measures.push(part);
  });
});
</script>
