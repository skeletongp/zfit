<template>
  <ion-page>
    <ion-header class="bg-primary ion-padding">
      <ion-toolbar>
        <div class="grid grid-cols-2 gap-2">
          <ion-searchbar
            v-model="params.search"
            @ionInput="onSearch"
            :debounce="300"
            placeholder="Buscar"
            class="col-span-2 mb-2"
            :animated="true"
          />
          <a-select
            class="w-full"
            placeholder="Ordenar por"
            :options="orderables"
            v-model:value="params.orderBy"
            @select="onOrderBy"
          >
            <template #suffixIcon>
              <caret-up-outlined v-if="params.ascend" class="ant-select-suffix" />
              <caret-down-outlined v-else class="ant-select-suffix" />
            </template>
          </a-select>
          <a-select
            class="w-full"
            placeholder="Todos"
            :options="groups"
            @change="onFilterGroup"
          />
          <span class="text-xs col-span-2 pt-2"
            >© 2010, Universidad Nacional de Luján. <br />
            * Por cada 100g</span
          >
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <NewFood v-if="$userRole(['admin'])" @onSave="onReset" />
      <ion-list v-if="foods.length > 0">
        <ion-item
          v-for="food in foods"
          :key="foods.id"
          class="shadow-xl py-2 pt-3 relative border border-gray-500"
        >
          <NutritionData :food="food">
            <div class="grid grid-cols-3 gap-0 space-x-4 w-full">
              <div class="col-span-3 uppercase font-bold ellipsis w-4/5 text-contrast">
                {{ food.name }}
              </div>
              <div class="col-span-1">Prot.: {{ food.Proteínas }}</div>
              <div class="col-span-1">kCal: {{ food.Calorías }}</div>
              <div class="col-span-1">Carb.: {{ food.Carbohidratos }}</div>
            </div>
          </NutritionData>
          <small class="absolute -top-1 right-1 ellipsis">{{ food.group }}</small>
        </ion-item>
        <ion-infinite-scroll v-if="foods.length > 9" @ionInfinite="onPaginate">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-list>
      <empty-card v-else :duration="1500" />
    </ion-content>
  </ion-page>
</template>
<script setup>
import { onMounted } from "vue";
import { onIonViewDidEnter } from "@ionic/vue";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue";
import NewFood from "@/components/foods/NewFood.vue";
import EditFood from "@/components/foods/EditFood.vue";
import NutritionData from "@/components/foods/NutritionData.vue";
import { useFoods } from "@/utils/foods";

const {
  params,
  foods,
  getFoods,
  onSearch,
  onOrderBy,
  orderables,
  groups,
  onFilterGroup,
} = useFoods();

const onReset = async () => {
  params.page = 1;
  foods.value = [];
  await getFoods();
};
const onPaginate = async (ev) => {
  params.page = params.page + 1;
  await getFoods();
  setTimeout(() => ev.target.complete(), 500);
};
onIonViewDidEnter(async () => {
  params.perPage = 15;
  params.orderBy = "name";
  params.page = 1;
  foods.value = [];
  await getFoods();
});
onMounted(async () => {
  params.page = 1;
  foods.value = [];
  await getFoods();
});
</script>
