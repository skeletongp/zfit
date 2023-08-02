<template>
  <div class="grid grid-cols-2 items-center">
    <div class="human-body">
      <div @click="highlight('head')" v-html="body.head"></div>
      <div @click="highlight('shoulder')" v-html="body.shoulder"></div>
      <div @click="highlight('arm')" v-html="body.arm"></div>
      <div @click="highlight('cheast')" v-html="body.cheast"></div>
      <div @click="highlight('stomach')" v-html="body.stomach"></div>
      <div @click="highlight('legs')" v-html="body.legs"></div>
      <div v-html="body.hands"></div>
      <CotaComponent :height="user.height || 0" />
    </div>

    <div class="w-44 whitespace-nowrap pl-2" v-if="datos.length > 0">
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
import CotaComponent from "@/components/profile/CotaComponent.vue";
const datos = ref([]);
const selected = ref(null);
import { useUserStore } from "@/store";
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});
const getData = async () => {
  try {
    const { data, error } = await supabase
      .from("evals")
      .select("*, measures(*)")
      .eq("profile_id", props.user.id)
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log(error);
    } else {
      datos.value = data.measures.filter((measure) => measure.key != "body");
    }
  } catch (error) {
    return;
  }
};

const highlight = (part) => {
  selected.value = part;
};

onMounted(async () => {
  datos.value = [];
  parts
    .filter((part) => part.key != "body")
    .forEach((piece) => {
      datos.value.push(piece);
    });
  await getData();
});
</script>
