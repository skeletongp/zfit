<template>
  <div
    class="w-full container sticky flex items-center -top-4 p-1 pb-6 z-20 bg-primary border-b-2"
  >
    <div
      class="!h-12 !w-12 !max-w-[3rem] !max-h-[3rem] bg-primary rounded-full overflow-hidden border-2"
    >
      <a-image :src="routine.image" :alt="routine.name" class="h-12 w-12" />
    </div>
    <h1
      class="w-full ellipsis text-white font-bold uppercase text-lg top-0 left-0 z-20 bg-primary bg-opacity-80 px-2 flex justify-between items-center title"
    >
      <div class="w-3/4 ellipsis">{{ routine.name }}</div>
      <div class="text-xs">{{ routine.duration }}</div>
    </h1>
  </div>
  <div class="flex flex-col space-y-6 px-1 pt-4">
    <div class="grid grid-cols-6 gap-x-2 items-center">
      <h1 class="uppercase col-span-1 font-bold text-contrast opacity-80">Obj.:</h1>
      <h1 class="col-span-5 text-base leading-5 line-clamp-3">
        {{ routine.goal }}
      </h1>
    </div>
    <div class="grid grid-cols-6 gap-x-2 items-center">
      <h1 class="uppercase col-span-1 font-bold text-contrast opacity-80">Edad:</h1>
      <h1 class="col-span-2">{{ routine.range }}</h1>
      <h1 class="uppercase col-span-1 font-bold text-contrast opacity-80">Peso:</h1>
      <h1 class="col-span-2">{{ routine.body }}</h1>
    </div>
    <div class="grid grid-cols-6 gap-2 items-center">
      <h1 class="uppercase col-span-2 font-bold text-contrast opacity-80">Detalles:</h1>
      <h1 class="col-span-6 list-decimal text-base" v-html="routine.description" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  routine: {
    type: Object,
    required: true,
  },
});
</script>
