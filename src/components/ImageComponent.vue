<template>
  <a-image :class="cstClass" :src="path" :alt="alt" fallback="src/assets/no-photo.png">
    <template #placeholder>
      <a-image src="src/assets/no-photo.png" :class="cstClass" :preview="false" />
    </template>
  </a-image>
</template>
<script setup>
const props = defineProps({
  cstClass: {
    type: String,
    default: "",
  },
  path: {
    type: String,
    default: "src/assets/no-photo.png",
  },
  alt: {
    type: String,
    default: "",
  },
});
</script>
