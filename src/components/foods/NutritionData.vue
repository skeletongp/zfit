<template>
  <div class="w-full" @click="openModal">
    <slot />
  </div>
  <ion-modal
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent"
    :initial-breakpoint="0.7"
    :isOpen="isOpen"
    class=""
  >
    <ion-header class="border-2 border-b-0 border-gray-300">
      <ion-toolbar>
        <ion-title slot="start">
          <div class="ellipsis w-full max-w-[18rem]">{{ food.name }}</div>
        </ion-title>
        <ion-button slot="end" color="primary" fill="clear" @click="closeModal">
          <svg-icon type="mdi" fill="#ffffff" :path="mdiCloseCircleOutline" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-primary border-2 border-t-0 border-gray-300">
      <div class="w-full max-w-sm mx-auto px-6 pt-4 flex flex-col space-y-4">
        <h1 class="text-center uppercase text-lg font-bold">Datos Nutricionales</h1>
        <h1 class=""><strong>Tamaño por porción</strong> 100g</h1>
        <div class="items-center grid grid-cols-6 text-lg">
          <strong class="col-span-2">Calorías:</strong>
          <span>{{ food.Calorías }}</span>
          <strong class="col-span-2">Proteínas:</strong>
          <span>{{ food.Proteínas }}</span>
          <hr class="col-span-6 mt-1 mb-4" />
          <!-- Grasas -->
          <strong class="col-span-5">Grasas totales:</strong>
          <span class="col-span-1">{{ food.Grasa }}</span>
          <strong class="col-span-2">Saturadas:</strong>
          <span>{{ food.Saturada }}</span>
          <strong class="col-span-2">Monoinsat.:</strong>
          <span>{{ food.Monoinsaturada }}</span>
          <strong class="col-span-2">Poliinsat.:</strong>
          <span>{{ food.Poliinsaturada }}</span>
          <strong class="col-span-2">Colesterol:</strong>
          <span>{{ food.Colesterol }}</span>
          <hr class="col-span-6 mt-1 mb-4" />

          <!-- Nutrientes -->
          <strong class="col-span-2">Carbohidratos:</strong>
          <span>{{ food.Carbohidratos }}</span>
          <strong class="col-span-2">Fibras:</strong>
          <span>{{ food.Fibras }}</span>
          <strong class="col-span-2">Vitamina C:</strong>
          <span>{{ food.Vitamina_C }}</span>
          <strong class="col-span-2">Sodio:</strong>
          <span>{{ food.Sodio }}</span>
          <strong class="col-span-2">Calcio:</strong>
          <span>{{ food.Calcio }}</span>
          <strong class="col-span-2">Potasio:</strong>
          <span>{{ food.Potasio }}</span>
          <strong class="col-span-2">Fósforo:</strong>
          <span>{{ food.Fósforo }}</span>
          <strong class="col-span-2">Hierro:</strong>
          <span>{{ food.Hierro }}</span>
          <strong class="col-span-2">Zinc:</strong>
          <span>{{ food.Zinc }}</span>
          <strong class="col-span-2">Tiamina:</strong>
          <span>{{ food.Tiamina }}</span>
          <strong class="col-span-2">Rivoflavina:</strong>
          <span>{{ food.Rivoflavina }}</span>
          <strong class="col-span-2">Niacina:</strong>
          <span>{{ food.Niacina }}</span>
          <strong class="col-span-2">V. Energético:</strong>
          <span>{{ food.Energía }}</span>
          <strong class="col-span-2">Agua:</strong>
          <span>{{ food.Agua }}</span>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script setup>
import { useModal } from "@/utils/helper";
import { mdiCloseCircleOutline } from "@mdi/js";
const props = defineProps({
  food: {
    type: Object,
    required: true,
  },
});

const {
  isOpen,
  openModal,
  closeModal,
  onModalDidPresent,
  onModalDidDismiss,
} = useModal();
</script>
