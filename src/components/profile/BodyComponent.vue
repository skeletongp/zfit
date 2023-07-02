<template>
  <div class="relative">
    <div class="human-body">
      <div @click="getData('head')" v-html="body.head"></div>
      <div @click="getData('shoulder')" v-html="body.shoulder"></div>
      <div @click="getData('arm')" v-html="body.arm"></div>
      <div @click="getData('cheast')" v-html="body.cheast"></div>
      <div @click="getData('stomach')" v-html="body.stomach"></div>
      <div @click="getData('legs')" v-html="body.legs"></div>
      <div v-html="body.hands"></div>
    </div>

    <div
      class="w-44 whitespace-nowrap absolute top-2 right-2 pl-2"
      v-if="datos.length > 0"
    >
      <div class="p-2 w-full" v-for="dato in datos">
        <div
          class="grid grid-cols-4 items-center"
          :class="dato.key == selected ? 'text-contrast' : ''"
        >
          <span class="col-span-3">{{ dato.name.toString().toUpperCase() }}</span>
          <span class="col-span-1">{{ dato.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import "@/theme/humanBody.css";
import body from "@/vars/humanBody";
import parts from "@/vars/bodyParts";
import { supabase } from "@/utils/supabase";
const datos = ref([]);
const selected = ref(null);
import { useUserStore } from "@/store";

const getData = async () => {
  const userStore = useUserStore();
  const user = userStore.getUser;
  const { data, error } = await supabase
    .from("evals")
    .select("*, measures(eval_id)")
    .eq("user_id", user.id);

  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }
};

onMounted(async () => {
  datos.value = [];
  parts.forEach((piece) => {
    datos.value.push(piece);
  });
  await getData();
});
</script>
