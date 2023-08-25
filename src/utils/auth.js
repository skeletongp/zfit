import { ref, reactive } from "vue";
import { supabase } from "@/utils/supabase";
import EventBus from "@/utils/eventBus";
import {  loadingController } from "@ionic/vue";

export function useLogin() {
  const user = reactive({
    email: null,
    password: null,
    remember: false,
  });
  const isOpen = ref(false);

  const onModalDidPresent = () => {
    user.email = null;
    user.password = null;
    const oldUser = JSON.parse(localStorage.getItem("zfitUser"))||{};
    user.email = oldUser.email ;
    user.password = oldUser.password ;
    user.remember =  oldUser.remember;
    isOpen.value = true;
  };

  const handleLogin = async () => {
    const loading = await showLoading();
    let instance = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    user.remember
      ? localStorage.setItem("zfitUser", JSON.stringify(user))
      : localStorage.removeItem("zfitUser");
    await getUser();
    loading.dismiss();
    return instance.error ? instance.error.message : "Bienvenido";
  };

  return { user, isOpen, onModalDidPresent, handleLogin };
}

export function useSignup() {
  const user = reactive({
    name: null,
    email: null,
    password: null,
    password_confirmation: null,
  });
  const validateConfirm = async (_rule, value) => {
    if (value !== user.password) {
      return Promise.reject("Las contraseñas no coinciden");
    } else {
      return Promise.resolve();
    }
  };
  const rules = {
    name: [
      { required: true, message: "Campo requerido" },
      { min: 5, message: "Nombre muy corto" },
    ],
    email: [
      { required: true, message: "Campo requerido" },
      { type: "email", message: "Formato inválido" },
    ],
    password: [
      { required: true, message: "Campo requerido" },
      { min: 8, message: "Mínimo 8 caracteres" },
      {
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&#_-ñÑ]{8,20}$/,
        message: "Debe contener Mayús., Mins. y Números",
      },
    ],
    password_confirmation: [
      { required: true, message: "Campo requerido" },
      { min: 8, message: "Mínimo 8 caracteres" },
      {
        pattern:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&#_-ñÑ]{8,20}$/,
        message: "Debe contener Mayús., Mins. y Números",
      },
      {
        validator: validateConfirm,
        trigger: "change",
      },
    ],
  };

  const isOpen = ref(false);
  const onModalDidPresent = () => {
    user.email = null;
    user.password = null;
    user.password_confirmation = null;
    user.name = null;
    isOpen.value = true;
  };

  const handleSignup = async () => {
    const loading = await showLoading();
    let logInstance = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });
    const allowedRoles = ["user", "admin", "client", "trainer"];
    if (!allowedRoles.includes(user.role) || !user.role) {
      user.role = "user";
    }
    const newUser = logInstance.data.user;
    const res = await supabase.rpc("create_user_and_contact", {
      name: user.name,
      email: user.email,
      role: user.role || "user",
      user_id: newUser.id,
    });

    loading.dismiss();
    const response =
      newUser.identities.length == 0
        ? {
            message: "Este usuario ya existe",
            status: 422,
            error: "Existing mail",
          }
        : res.error
        ? {
            message: res.error.message,
            status: 501,
            error: "Error al crear usuario",
          }
        : logInstance.error
        ? {
            message: "Se ha enviado un correo de confirmación",
            status: 200,
            error: null,
          }
        : {
            message: logInstance.error.message,
            status: 500,
            error: "Error al crear cuenta",
          };
    return response;
  };

  return { rules, user, isOpen, handleSignup, onModalDidPresent };
}
const showLoading = async () => {
  const loading = await loadingController.create({
    message: "Cargando...",
  });

  loading.present();
  return loading;
};
export const getUser = async () => {
  const user = {};
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    user.id = session.user.id;
    user.email = session.user.email;
    const relatedUser = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    user.address = relatedUser.data?.address;
    user.name = relatedUser.data?.name;
    user.birthdate = relatedUser.data?.birthdate;
    user.photo = relatedUser.data?.photo || "src/assets/no-photo.png";
    user.price = relatedUser.data?.price || 0;
    user.start_date = relatedUser.data?.start_date;
    user.height = relatedUser.data?.height;
    user.role = relatedUser.data?.role || "user";
    user.relatedUser_id = relatedUser.data?.id;
    localStorage.setItem("zfitLoggedUser", JSON.stringify(user));
    EventBus.emit('userChanged', user)
  }
};
