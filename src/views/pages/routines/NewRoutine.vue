<template>
  <ion-page>
    <ion-content class="">
      <div class="w-full max-w-md mx-auto h-[35vh] p-4 flex flex-col">
        <a-form
          layout="vertical"
          :model="routine"
          @finish="onFinish"
          name="routine"
          class="w-full"
        >
          <a-form-item name="name" label="Nombre de la rutina" :rules="rules.name">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              v-model:value="routine.name"
              placeholder="Ingrese un nombre"
            />
          </a-form-item>
          <a-form-item
            name="description"
            :rules="rules.description"
            label="Descripción de la rutina"
          >
            <quill-editor
              v-model:content="routine.description"
              :content="routine.description"
              toolbar="minimal"
              theme="snow"
              contentType="html"
            />
          </a-form-item>
          <a-form-item name="goal" label="Objetivo" :rules="rules.goal">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              v-model:value="routine.goal"
              placeholder="Describa el propósito de la rutina"
            />
          </a-form-item>
          <div class="flex items-center space-x-2">
            <a-form-item
              name="range"
              :label="`Edad (${range[0]}-${range[1]} a)`"
              :rules="rules.range"
              class="w-1/3 px-2"
            >
              <a-slider
                :style="{ backgroundColor: 'red' }"
                v-model:value="range"
                range
                :min="16"
                :max="65"
                color="red"
              />
            </a-form-item>
            <a-form-item
              name="duration"
              :label="`Dur. (${duration[0]}-${duration[1]} m)`"
              :rules="rules.duration"
              class="w-1/3 px-2"
            >
              <a-slider v-model:value="duration" range :min="10" :max="60" />
            </a-form-item>
            <a-form-item
              name="body"
              :label="`Peso (${body[0]}-${body[1]} Kg)`"
              :rules="rules.body"
              class="w-1/3 px-2"
            >
              <a-slider v-model:value="body" range :min="50" :max="140" />
            </a-form-item>
          </div>

          <a-form-item name="image" :rules="rules.image" label="Foto o imagen">
            <photo-chooser @on-photo="setPhoto" />
          </a-form-item>
          <ion-button
            type="submit"
            class="font-bold"
            color="warning"
            fill="outline"
            shape="round"
            expand="block"
          >
            Registrar
          </ion-button>
        </a-form>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { ref } from "vue";
import { useNewRoutine } from "@/utils/routines";
import { useRouter } from "vue-router";
const range = ref([16, 65]);
const duration = ref([10, 60]);
const body = ref([50, 140]);

const { routine, rules, saveRoutine } = useNewRoutine();
const router = useRouter();
const setPhoto = (photo) => {
  routine.image = photo;
};

const onFinish = async () => {
  routine.range = `${range.value[0]}-${range.value[1]} años`;
  routine.duration = `${duration.value[0]}-${duration.value[1]} Mins.`;
  routine.body = `${body.value[0]}-${body.value[1]} Kgs.`;
  const res = await saveRoutine(routine);
  router.push({ path: "/pages/routines/" + res.id });
};
</script>
