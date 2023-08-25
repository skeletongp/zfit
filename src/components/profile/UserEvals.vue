<template>
  <div class="relative h-full">
    <div class="p-4 flex items-center justify-between space-x-2">
      <a-select
        :options="options"
        :show-search="true"
        :filter-option="$filterOption"
        @change="getEval"
        placeholder="Evaluaciones"
        class="w-full"
        size="large"
      >
      </a-select>
    </div>
    <div class="w-full whitespace-nowrap pl-2" v-if="measures.length > 0">
      <div class="p-2 w-full grid grid-cols-2 gap-4">
        <span v-if="evaluation" class="col-span-2 text-contrast w-full ellipsis">
          {{ evaluation.observation }}<sup>*</sup>
        </span>
        <div v-for="dato in measures" class="grid grid-cols-4 items-center col-span-1">
          <span class="col-span-3">{{ dato.name.toString().toUpperCase() }}</span>
          <span class="col-span-1">{{ dato.value }}</span>
        </div>
      </div>
      <div class="flex justify-end">
        <small class="text-contrast opacity-50"><sup>*</sup> Medidas en Kg. y Cm.</small>
      </div>
      <div
        class="h-24 overflow-hidden w-full grid grid-cols-4 gap-4 py-2"
        v-if="photos.length > 0"
      >
        <div
          class="w-full h-24 col-span-1 relative"
          v-for="(photo, index) in photos"
          :key="index + 'p'"
        >
          <image-component
            cstClass="w-full h-36"
            :path="photo.path"
            :alt="'photo' + index"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import "@/theme/humanBody.css";
import parts from "@/vars/bodyParts";
import { useEvals } from "@/utils/evals";
import { supabase } from "@/utils/supabase";
import moment from "moment";
const { evals, params, getEvals, evaluation, findEval } = useEvals();
const measures = ref([]);
const photos = ref([]);
const options = ref([]);
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const getData = async () => {
  params.cols = "*, measures(*), evalphotos(*)";
  params.filters = [{ key: "user_id", value: props.user.id }];
  params.limit = 45;
  await getEvals();
  evals.value.forEach((dat) => {
    options.value.push({
      value: dat.id,
      label: moment(dat.date).format("DD-MM-YYYY") + " - " + dat.observation,
    });
  });
  if (evals.value.length > 0) {
    await getEval(evals.value[0].id);
  }
};

const getEval = async (id) => {
  await findEval(id);
  if (evaluation.value) {
    measures.value = evaluation.value.measures || [];
    photos.value = evaluation.value.evalphotos || [];
  }
};

const suscribeForChanges = async () => {
  const evals = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "evals" },
      async (payload) => {
        await getData();
      }
    )
    .subscribe();
};

onMounted(async () => {
  measures.value = [];
  parts.forEach((piece) => {
    measures.value.push(piece);
  });
  await getData();
  await suscribeForChanges();
});
</script>
