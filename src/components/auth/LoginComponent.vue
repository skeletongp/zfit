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
    :initial-breakpoint="0.4"
    :breakpoints="[0.4]"
  >
    <ion-content>
      <div class="w-full max-w-sm mx-auto h-[40vh] px-6 flex items-center">
        <a-form :model="user" @finish="handleLogin" name="login" class="w-full space-y-8">
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
              placeholder="Contraseña"
            />
            <div class="w-full flex justify-end p-2">
              <ion-checkbox v-model="user.remember" :checked="user.remember">
                <span class="text-white">Recuérdame</span>
              </ion-checkbox>
            </div>
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
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import * as mdi from "@mdi/js";
import { supabase } from "@/utils/supabase";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
const router = useRouter();
const user = reactive({
  email: "",
  password: "",
  remember: false,
});

const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
};

const onModalDidDismiss = () => {
  isOpen.value = false;
};

const onModalDidPresent = () => {
  user.email = "";
  user.password = "";
  const oldUser = JSON.parse(localStorage.getItem("zfitUser"));
  if (oldUser) {
    user.email = oldUser.email;
    user.password = oldUser.password;
    user.remember = oldUser.remember;
  }
  isOpen.value = true;
};

const handleLogin = async () => {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    if (error) {
      if (error.message.includes("not confirmed")) {
        message.error("Debe confirmar su correo electrónico");
        return;
      }
      message.error("Error al iniciar sesión");
      return;
    }
    message.success("Sesión iniciada correctamente");
    if (user.remember) {
      localStorage.setItem("zfitUser", JSON.stringify(user));
    } else{
      localStorage.removeItem("zfitUser");
    }
    closeModal();

    router.push({ name: "home" });
    window.location.reload();
  } catch (error) {
    message.error(error.error_description || error.message);
  }
};
</script>
