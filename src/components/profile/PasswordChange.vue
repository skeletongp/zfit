<template>
  <ion-button color="light" fill="clear" type="text" @click="openModal">
    <ion-icon :icon="icon.keyOutline" class="text-xl hover:text-contrast" />
  </ion-button>

  <ion-modal
    @ionModalDidDismiss="onModalDidDismiss"
    @ionModalDidPresent="onModalDidPresent"
    :initial-breakpoint="0.55"
    :isOpen="isOpen"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title slot="start">
          <ion-label>Cambiar contraseña</ion-label>
        </ion-title>
        <ion-button slot="end" color="primary" fill="clear" @click="closeModal">
          <svg-icon type="mdi" fill="#ffffff" :path="mdiCloseCircleOutline" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="bg-primary">
      <div class="w-full max-w-sm mx-auto px-6 pt-4 flex items-center">
        <a-form
          :model="user"
          @finish="resetPassword"
          name="signup"
          class="w-full grid grid-cols-2 gap-y-4 gap-x-2"
        >
          <a-form-item name="password" :rules="rules.password" class="col-span-2">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="password"
              v-model:value="user.password"
              placeholder="Nueva Contraseña"
            />
          </a-form-item>
          <a-form-item
            name="password_confirmation"
            :rules="rules.password_confirmation"
            class="col-span-2"
          >
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
            class="font-bold col-span-2"
            color="warning"
            fill="outline"
            expand="block"
          >
            Confirmar
          </ion-button>
        </a-form>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script setup>
import { onMounted } from "vue";
import * as icon from "ionicons/icons";
import { useModal } from "@/utils/helper";
import { useResetPassword } from "@/utils/users";
import { mdiCloseCircleOutline } from "@mdi/js";
const { user, rules, resetPassword } = useResetPassword();
const {
  isOpen,
  openModal,
  closeModal,
  onModalDidPresent,
  onModalDidDismiss,
} = useModal();

onMounted(async () => {});
</script>
