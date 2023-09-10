<template>
  <ion-fab slot="fixed" vertical="bottom" horizontal="end">
    <ion-fab-button @click="openModal">
      <ion-icon :icon="add" />
    </ion-fab-button>
  </ion-fab>
  <ion-modal
    @willPresent="onModalPresent"
    @willDismiss="onModalDismiss"
    :is-open="isOpen"
    :backdrop-dismiss="false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro de Alimento</ion-title>
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
        name="food"
        class="w-full"
      >
        <div class="grid grid-cols-4 gap-x-2 items-center">
          <a-form-item
            name="name"
            label="Nombre del alimento"
            :rules="rules.name"
            class="col-span-4"
          >
            <a-auto-complete
              size="large"
              class="bg-transparent text-white py-2"
              v-model:value="food.name"
              placeholder="Ingrese un nombre"
              :options="options"
              :filter-option="filterOption"
            />
          </a-form-item>
          <a-form-item
            name="group"
            label="Grupo alimenticio"
            :rules="rules.group"
            class="col-span-3"
          >
            <a-select
              size="large"
              class="bg-transparent text-white"
              v-model:value="food.group"
              :options="groups"
              :filter-option="filterOption"
              show-search
              placeholder="Seleccione una opción"
            />
          </a-form-item>
          <a-form-item
            v-for="(nutrient, index) in nutrients"
            :key="index"
            :name="nutrient.name"
            :label="nutrient.label"
            :rules="rules[nutrient.name]"
            class="col-span-1"
          >
            <a-input
              size="large"
              type="number"
              step="0.01"
              class="bg-transparent text-white"
              v-model:value="food[nutrient.name]"
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
          Registrar
        </ion-button>
      </a-form>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { useNewFood } from "@/utils/foods";
import { add, close } from "ionicons/icons";
import { filterOption, useSuggest } from "@/utils/parse";
const isOpen = ref(false);
const { food, rules, groups, nutrients, saveFood, resetFood } = useNewFood();

const { options, getOptions } = useSuggest();
const emit = defineEmits(["onSave"]);
const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};
const onModalPresent = async () => {
  await getOptions("foods", "name");
  isOpen.value = true;
};
const onModalDismiss = () => {
  isOpen.value = false;
};

const onFinish = async () => {
  const res = await saveFood();

  if (res) {
    resetFood();
    closeModal();
    setTimeout(() => {
      emit("onSave");
    }, 300);
  }
};
</script>
