<template>
  <svg class="absolute top-0 -left-2 -z-20 h-full">
    <text x="0%" y="60%" class="cota-text">{{ height }} cm</text>
    <line x1="8%" y1="0" x2="25%" y2="0" stroke="black" stroke-width="2" class="cota" />
    <line x1="8%" y1="0" x2="8%" y2="58%" stroke="black" stroke-width="2" class="cota" />
    <line
      x1="8%"
      y1="62%"
      x2="8%"
      y2="100%"
      stroke="black"
      stroke-width="2"
      class="cota"
    />
    <line
      x1="8%"
      y1="100%"
      x2="25%"
      y2="100%"
      stroke="black"
      stroke-width="2"
      class="cota"
    />
  </svg>
</template>
<script setup>
const props = defineProps({
  height: {
    type: Number,
    default: 0,
  },
});
</script>
