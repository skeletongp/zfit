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

    <div class="w-44 whitespace-nowrap pl-2" v-if="measures.length > 0">
      <div class="p-2 w-full" v-for="measure in measures">
        <div
          class="grid grid-cols-4 items-center"
          :class="measure.key == selected ? 'text-contrast' : ''"
        >
          <span class="col-span-3">{{ measure.name.toString().toUpperCase() }}</span>
          <span class="col-span-1">{{ measure.value }}</span>
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
import { useUsers } from "@/utils/users";
import CotaComponent from "@/components/profile/CotaComponent.vue";
const { getMeasures } = useUsers();
const measures = ref([]);
const selected = ref(null);
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const highlight = (part) => {
  selected.value = part;
};

onMounted(async () => {
  measures.value = [];
  parts
    .filter((part) => part.key != "body")
    .forEach((piece) => {
      measures.value.push(piece);
    });
  const newMeasures = await getMeasures(props.user.id);
  measures.value = newMeasures.length > 0 ? newMeasures : measures.value;
});
</script>
