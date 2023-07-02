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
          <a-form-item name="name" :rules="rules">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="name"
              v-model:value="user.name"
              placeholder="Nombre Completo"
            />
          </a-form-item>
          <a-form-item name="email" :rules="rules">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="email"
              v-model:value="user.email"
              placeholder="Correo electrónico"
            />
          </a-form-item>
          <a-form-item name="password" :rules="rules">
            <a-input
              size="large"
              class="bg-transparent text-white rounded-xl py-2"
              type="password"
              v-model:value="user.password"
              placeholder="Contraseña"
            />
          </a-form-item>
          <a-form-item name="password_confirmation" :rules="rules">
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
import { ref, reactive, computed } from "vue";
import * as mdi from "@mdi/js";
import { supabase } from "@/utils/supabase";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { alertController } from "@ionic/vue";
const router = useRouter();
const rules = [
  {
    required: true,
    message: "El campo es obligatorio",
  },
];

const user = reactive({
  email: "",
  password: "",
  password_confirmation: "",
  name: "",
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
  user.password_confirmation = "";
  user.name = "";
  isOpen.value = true;
};
const handleSignup = async () => {
  try {
    if (user.password !== user.password_confirmation) {
      message.error("Las contraseñas no coinciden");
      return;
    }
    const role = user.email == "contrerasismael0@gmail.com" ? "admin" : "user";
    let { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      role:role
    });
    if (error) {
      message.error("Error al crear cuenta");
      return;
    }
    const newUser = data.user;

    const profile = await supabase.from("profiles").insert([
      {
        user_id: newUser.id,
        name: user.name,
        role: role
      },
    ]);
    if (profile.error) {
      message.error("Error al crear cuenta");
      return;
    }
    const contact = await supabase.from("contacts").insert([
      {
        user_id: newUser.id,
        name: "Email",
        url: "mailto:" + user.email,
        username: user.email,
        icon: "mailOpenOutline",
      },
    ]);
    if (contact.error) {
      message.error("Error al crear cuenta");
      return;
    }
    alertSuccess("Hemos enviado un correo de confirmación a tu cuenta");
  } catch (error) {
    message.error(error.error_description || error.message);
  }
};

const alertSuccess = async (message) => {
  closeModal();
  const alert = await alertController.create({
    header: "¡Cuenta Creada!",
    message,
    buttons: ["OK"],
  });
  await alert.present();
};
</script>
