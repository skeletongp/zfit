<template>
  <div class="h-16 w-full container sticky flex items-center -top-4 p-1 z-20 bg-primary">
    <div
      class="!h-12 !w-12 !max-w-[3rem] !max-h-[3rem] bg-primary rounded-full overflow-hidden border-2"
    >
      <a-image :src="path" :alt="title" class="h-12 w-12" />
    </div>
    <h1
      class="w-full ellipsis text-white font-bold uppercase text-lg top-0 left-0 z-20 bg-primary bg-opacity-80 px-2 flex justify-between items-center title"
    >
      <div class="w-3/4 ellipsis">{{ title }}</div>
      <div class="text-xs">{{ subtitle }}</div>
    </h1>
  </div>

  <hr class="my-4" />
</template>
<script setup>
const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
});
</script>
