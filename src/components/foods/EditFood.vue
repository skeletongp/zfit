<template>
  <ion-button fill="clear" class="ion-no-padding" color="light" @click="openModal">
    <ion-icon :icon="optionsOutline" />
  </ion-button>

  <ion-modal
    @willPresent="onModalPresent"
    @willDismiss="onModalDismiss"
    :breakpoints="[0.8]"
    :initial-breakpoint="0.8"
    :is-open="isOpen"
    :backdrop-dismiss="false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Actualizar alimento</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-primary ion-padding">
      <a-form
        layout="vertical"
        :model="food"
        @finish="onFinish"
        :name="'food' + food.id"
        class="w-full"
      >
        <div class="grid grid-cols-6 gap-2 items-center">
          <a-form-item
            name="name"
            label="Nombre del alimento"
            :rules="rules.name"
            class="col-span-6"
          >
            <a-input
              size="large"
              class="bg-transparent text-white py-2"
              v-model:value="food.name"
              placeholder="Ingrese un nombre"
            />
          </a-form-item>
          <a-form-item
            name="group"
            label="Grupo alimenticio"
            :rules="rules.group"
            class="col-span-4"
          >
            <a-select
              size="large"
              class="bg-transparent text-white py-2"
              v-model:value="food.group"
              :options="groups"
              :filter-option="filterOption"
              show-search
              placeholder="Seleccione una opción"
            />
          </a-form-item>

          <a-form-item
            name="unit"
            label="Porción/Medida"
            :rules="rules.unit"
            class="col-span-2"
          >
            <a-select
              size="large"
              class="bg-transparent text-white py-2"
              v-model:value="food.unit"
              :options="units"
              placeholder="Seleccione"
            />
          </a-form-item>
          <a-form-item
            name="proteins"
            label="Proteínas"
            :rules="rules.proteins"
            class="col-span-3"
          >
            <a-input
              size="large"
              type="number"
              step="0.01"
              class="bg-transparent text-white py-2"
              v-model:value="food.proteins"
              placeholder="Ingrese un valor"
            />
          </a-form-item>
          <a-form-item
            name="calories"
            label="Calorías"
            :rules="rules.calories"
            class="col-span-3"
          >
            <a-input
              size="large"
              type="number"
              step="0.01"
              class="bg-transparent text-white py-2"
              v-model:value="food.calories"
              placeholder="Ingrese un valor"
            />
          </a-form-item>
        </div>
        <ion-button
          type="submit"
          class="font-bold"
          color="warning"
          fill="outline"
          shape="round"
          expand="block"
        >
          Actualizar
        </ion-button>
      </a-form>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref } from "vue";
import { useNewFood } from "@/utils/foods";
import { optionsOutline, close } from "ionicons/icons";
import { filterOption } from "@/utils/parse";

const props = defineProps({
  oldFood: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["onSave"]);

const isOpen = ref(false);
const { food, rules, groups, units, updateFood } = useNewFood();
const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};
const onModalPresent = async () => {
  isOpen.value = true;
  Object.assign(food, props.oldFood);
};
const onModalDismiss = () => {
  isOpen.value = false;
};

const onFinish = async () => {
  const res = await updateFood();
  if (res) {
    closeModal();
    setTimeout(() => {
      emit("onSave");
    }, 300);
  }
};
</script>
