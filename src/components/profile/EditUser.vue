<template>
  <div class="w-full h-full py-4">
    <a-form
      :model="user"
      name="editUser"
      layout="vertical"
      @finish="onFinish"
      class="max-w-xs mx-auto"
    >
      <div class="grid grid-cols-6 gap-x-2 w-full items-center">
        <a-form-item
          class="col-span-6"
          name="name"
          :rules="rules.name"
          label="Nombre completo"
        >
          <a-input v-model:value="user.name" size="large" />
        </a-form-item>
        <a-form-item
          class="col-span-6"
          name="address"
          :rules="rules.address"
          label="Dirección"
        >
          <a-input v-model:value="user.address" size="large" />
        </a-form-item>
        <a-form-item
          class="col-span-3"
          name="birthdate"
          :rules="rules.birthdate"
          label="Fecha de nacimiento"
        >
          <a-input type="date" v-model:value="user.birthdate" size="large" />
        </a-form-item>
        <a-form-item
          class="col-span-3"
          name="height"
          :rules="rules.height"
          label="Estatura (cm)"
        >
          <a-input type="number" v-model:value="user.height" size="large" />
        </a-form-item>
        <a-form-item
          v-if="$userRole(['trainer', 'admin'])"
          class="col-span-3"
          name="price"
          :rules="rules.price"
          label="Precio"
        >
          <a-input type="number" v-model:value="user.price" size="large" />
        </a-form-item>

        <ion-button
          type="submit"
          class="font-bold col-span-6"
          color="warning"
          fill="outline"
          expand="block"
        >
          Actualizar
        </ion-button>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { useEditUser } from "@/utils/users";

const { user, rules, updateUser, loadUser } = useEditUser();

const props = defineProps({
  prevUser: {
    type: Object,
    required: true,
  },
});
const setPhoto = (photo) => {
  user.photo = photo;
};
const onFinish = async () => {
  const res = await updateUser();
};

onBeforeMount(async () => {
  await loadUser(props.prevUser);
});
</script>
