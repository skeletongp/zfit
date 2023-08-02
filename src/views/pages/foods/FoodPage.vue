<template>
  <ion-page>
    <ion-header class="bg-primary ion-padding">
      <ion-toolbar>
        <ion-searchbar
          v-model="params.search"
          @ionInput="onSearch"
          :debounce="300"
          placeholder="Buscar"
        />
      </ion-toolbar>
      <ion-toolbar>
        <div class="grid grid-cols-2 gap-2">
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
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <NewFood v-if="$userRole('admin')" @onSave="onReset" />
      <ion-list v-if="foods.length > 0">
        <ion-item
          v-for="food in foods"
          :key="foods.id"
          class="shadow-xl px-1.5 py-2 relative border border-gray-500"
        >
          <div class="grid grid-cols-3 gap-0 space-x-4 w-full">
            <div class="col-span-3 uppercase font-bold">{{ food.name }}</div>
            <div class="col-span-1">Prot.: {{ food.proteins }}</div>
            <div class="col-span-1">Cal.: {{ food.calories }}</div>
            <div class="col-span-1">X {{ food.unit }}</div>
          </div>
          <span class="absolute top-0 right-1">{{ food.group }}</span>
          <div class="absolute -bottom-2 right-1">
            <EditFood
              :oldFood="food"
              v-if="$userRole('admin')"
              @onSave="onReset"
              :key="food.id"
            />
          </div>
        </ion-item>
        <ion-infinite-scroll v-if="foods.length > 9" @ionInfinite="onPaginate">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-list>
      <empty-card v-else />
    </ion-content>
  </ion-page>
</template>
<script setup>
import { onMounted } from "vue";
import { onIonViewDidEnter } from "@ionic/vue";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue";
import NewFood from "@/components/foods/NewFood.vue";
import EditFood from "@/components/foods/EditFood.vue";
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
