<template>
  <ion-button
    @click="openModal"
    class="font-bold"
    color="light"
    fill="outline"
    shape="round"
  >
    Crear Cuenta
  </ion-button>
  <ion-modal
    :is-open="isOpen"
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent"
    :initial-breakpoint="0.65"
    :breakpoints="[0.65]"
  >
    <ion-content>
      <div class="w-full max-w-sm mx-auto h-[65vh] px-6 flex items-center">
        <a-form
          :model="user"
          @finish="handleSignup"
          name="signup"
          class="w-full space-y-8"
        >
          <a-form-item name="name" :rules="rules.name">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="text"
              v-model:value="user.name"
              placeholder="Nombre Completo"
            />
          </a-form-item>
          <a-form-item name="email" :rules="rules.email">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="email"
              v-model:value="user.email"
              placeholder="Correo electrónico"
            />
          </a-form-item>
          <a-form-item name="password" :rules="rules.password">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="password"
              v-model:value="user.password"
              placeholder="Contraseña"
            />
          </a-form-item>
          <a-form-item name="password_confirmation" :rules="rules.password_confirmation">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="password"
              v-model:value="user.password_confirmation"
              placeholder="Confirme su contraseña"
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
            crear cuenta
          </ion-button>
        </a-form>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSignup } from "@/utils/auth";

const { user, rules, isOpen, onModalDidPresent, handleSignup } = useSignup();
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
</script>
