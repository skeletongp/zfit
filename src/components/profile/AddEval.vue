<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button @click="openModal">
      <ion-icon :icon="icon.add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-modal
    :is-open="isOpen"
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent"
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
                <a-input
                  size="large"
                  class="bg-transparent text-white rounded-xl"
                  type="text"
                  readonly
                  :value="measure.label"
                  placeholder="Parte"
                />
              </div>
              <div class="col-span-1">
                <a-input
                  size="large"
                  class="bg-transparent text-white rounded-xl"
                  type="number"
                  step="0.01"
                  v-model:value="measure.value"
                  placeholder="Valor"
                />
              </div>
            </template>
          </div>
        </div>
        <a-form
          :model="evaluation"
          @finish="storeEvaluation"
          name="addEval"
          class="w-full grid grid-cols-5 gap-2"
        >
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
            <a-image class="w-full h-full" :src="photo.webPath" :alt="'photo' + index" />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import * as icon from "ionicons/icons";
import parts from "@/vars/bodyParts";
import { supabase } from "@/utils/supabase";
import { message } from "ant-design-vue";
import { pathToFile, loading } from "@/utils/helper";
import moment from "moment";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
const photos = ref([]);
const rules = [
  {
    required: true,
    message: "El campo es obligatorio",
  },
];
const evaluation = reactive({
  observation: "",
  date: "",
  profile_id: "",
});

var measures = reactive([]);

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const onModalDidDismiss = () => {
  isOpen.value = false;
};

const onModalDidPresent = () => {
  evaluation.profile_id = props.user.id;
  evaluation.date = null;
  evaluation.observation = "";

  isOpen.value = true;
};

const setPhotos = (newPhotos) => {
  newPhotos.forEach((photo) => {
    photos.value.push(photo);
  });
};

const removePhoto = (index) => {
  photos.value.splice(index, 1);
};

const storeEvaluation = async () => {
  try {
    loading(true);
    const { data, error } = await supabase
      .from("evals")
      .insert([
        {
          observation: evaluation.observation,
          date: evaluation.date,
          profile_id: evaluation.profile_id,
        },
      ])
      .select()
      .single();
    if (error) {
      message.error("No se pudo registrar la evaluación");
      loading(false);
      return;
    }
    for (let i = 0; i < measures.length; i++) {
      let measure = measures[i];
      await supabase.from("measures").insert([
        {
          key: measure.key,
          name: measure.name,
          value: parseFloat(measure.value),
          eval_id: data.id,
        },
      ]);
    }
    for (let i = 0; i < 4; i++) {
      let photo = photos.value[i];
      if (photo) {
        const file = await pathToFile(photo.webPath);
        await storePhotos(data.id, file);
      }
    }
    message.success("Evaluación registrada con éxito");
    loading(false);
    closeModal();
  } catch (error) {
    loading(false);
    console.log(error);
    message.error("No se pudo registrar la evaluación");
  }
};

const storePhotos = async (eval_id, file) => {
  const now = moment().unix();
  const name = `${now}`;
  const { data, error } = await supabase.storage.from("zfit_storage").upload(name, file);
  if (error) {
    console.log(error);
  } else {
    const res = await supabase.storage.from("zfit_storage").getPublicUrl(name);
    console.log(res);
    const photoFile = await supabase.from("evalphotos").insert([
      {
        path: res.data.publicUrl,
        eval_id: eval_id,
      },
    ]);
  }
};

onMounted(async () => {
  parts.forEach((part) => {
    measures.push(part);
  });
});
</script>
