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
    <div class="w-full whitespace-nowrap pl-2" v-if="datos.length > 0">
      <div class="p-2 w-full grid grid-cols-2 gap-4">
        <span v-if="evaluation" class="col-span-2 text-contrast w-full ellipsis">
          {{ evaluation.observation }}<sup>*</sup>
        </span>
        <div v-for="dato in datos" class="grid grid-cols-4 items-center col-span-1">
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
          <a-image class="w-full h-full" :src="photo.path" :alt="'photo' + index" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import "@/theme/humanBody.css";
import parts from "@/vars/bodyParts";
import { supabase } from "@/utils/supabase";
import moment from "moment";

const datos = ref([]);
const photos = ref([]);
const options = ref([]);
const evals = ref([]);
const evaluation = ref(null);
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const getData = async () => {
  const { data, error } = await supabase
    .from("evals")
    .select("*, measures(*), evalphotos(*)")
    .eq("user_id", props.user.id)
    .order("id", { ascending: false })
    .limit(45);

  if (error) {
    console.log(error);
  } else {
    evals.value = data;
    data.forEach((dat) => {
      options.value.push({
        value: dat.id,
        label: moment(dat.date).format("DD-MM-YYYY") + " - " + dat.observation,
      });
    });
  }
};

const getEval = async (id) => {
  evaluation.value = evals.value.find((eva) => eva.id == id);
  if (evaluation.value) {
    datos.value = evaluation.value.measures;
    photos.value = evaluation.value.evalphotos;
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
  datos.value = [];
  parts.forEach((piece) => {
    datos.value.push(piece);
  });
  await getData();
  await suscribeForChanges();
});
</script>
