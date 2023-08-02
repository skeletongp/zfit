<template>
  <ion-button
    @click="openModal"
    class="font-bold"
    color="warning"
    fill="outline"
    shape="round"
  >
    Acceder
  </ion-button>
  <ion-modal
    :is-open="isOpen"
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent"
    :initial-breakpoint="0.35"
    :breakpoints="[0.35]"
  >
    <ion-content>
      <div class="w-full max-w-sm mx-auto h-[35vh] p-6 flex flex-col">
        <a-form :model="user" @finish="onLogin" name="login" class="w-full">
          <a-form-item
            name="email"
            :rules="[{ required: true, message: 'Debe Ingresar su Correo' }]"
          >
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="email"
              v-model:value="user.email"
              placeholder="Correo electrónico"
            />
          </a-form-item>
          <a-form-item
            name="password"
            :rules="[{ required: true, message: 'Debe Ingresar su Contraseña' }]"
          >
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="password"
              v-model:value="user.password"
              @pressEnter="onLogin"
              placeholder="Contraseña"
            />
          </a-form-item>

          <ion-button
            type="submit"
            class="font-bold"
            color="warning"
            fill="outline"
            shape="round"
            expand="block"
          >
            Iniciar Sesión
          </ion-button>
        </a-form>
        <div class="w-full flex justify-end px-2 mt-8">
          <ion-checkbox v-model="user.remember" :checked="user.remember">
            <span class="text-white">Recuérdame</span>
          </ion-checkbox>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useLogin } from "@/utils/auth";

const { user, isOpen, onModalDidPresent, handleLogin } = useLogin();
const router = useRouter();

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const onModalDidDismiss = () => {
  isOpen.value = false;
};

const onLogin = async () => {
  const res = await handleLogin();
  if (res) {
    closeModal();
    router.push({ name: "home" });
  }
};
</script>
