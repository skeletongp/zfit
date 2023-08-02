import { ref, reactive } from "vue";
import { supabase } from "@/utils/supabase";
import { message } from "ant-design-vue";
import { alertController, loadingController } from "@ionic/vue";

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
      const loading=await showLoading();
      let { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });
      if (error) {
        if (error.message.includes("not confirmed")) {
          message.error("Debe confirmar su correo electrónico");
          loading.dismiss();
          return false;
        }
        message.error("Error al iniciar sesión");
        loading.dismiss();
        return false;
      }
      message.success("Sesión iniciada correctamente");
      if (user.remember) {
        localStorage.setItem("zfitUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("zfitUser");
      }
      await getUser();
      loading.dismiss();

      return true;
    } catch (error) {
      message.error(error.error_description || error.message);
      return false;
    }
  };

  return { user, isOpen, onModalDidPresent, handleLogin };
}

export function useSignup() {
  const rules = [
    {
      required: true,
      message: "El campo es obligatorio",
    },
  ];

  const user = reactive({
    email: null,
    password: null,
    password_confirmation: null,
    name: null,
  });

  const isOpen = ref(false);
  const onModalDidPresent = () => {
    user.email = null;
    user.password = null;
    user.password_confirmation = null;
    user.name = null;
    isOpen.value = true;
  };

  const handleSignup = async () => {
    try {
      if (user.password !== user.password_confirmation) {
        message.error("Las contraseñas no coinciden");
        return;
      }
      const loading=await showLoading();
      const role =
        user.email == import.meta.env.VITE_TEST_EMAIL ? "admin" : "user";
      let { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        role: role,
      });
      if (error) {
        message.error("Error al crear cuenta");
        loading.dismiss();
        return;
      }
      const newUser = data.user;
    const res=  await supabase.rpc("create_user_and_contact",{
        name:user.name,
        email: user.email,
        password: user.password,
        user_id: newUser.id,
      })
      console.log(res)
      if(res.error){
        message.error("Error al crear cuenta");
        loading.dismiss();
        return;
      }
     
      alertSuccess("Hemos enviado un correo de confirmación a tu cuenta");
      loading.dismiss();
      return true;
    } catch (error) {
      console.log(error)
      message.error(error.error_description || error.message);
    }
  };
  const alertSuccess = async (message) => {
    isOpen.value = false;
    const alert = await alertController.create({
      header: "¡Cuenta Creada!",
      message,
      buttons: ["OK"],
    });
    await alert.present();
  };

  return { rules, user, isOpen, handleSignup, onModalDidPresent };
}
const showLoading = async () => {
  const loading = await loadingController.create({
    message: 'Cargando...',
  });

  loading.present();
  return loading;
};
const getUser = async () => {
  const user = {};
  const allowedRoles = ["user", "admin", "client", "trainer"];
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    user.id = session.user.id;
    user.email = session.user.email;
    const profile = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

    user.address = profile.data?.address;
    user.name = profile.data?.name;
    user.birthdate = profile.data?.birthdate;
    user.photo = profile.data?.photo || "src/assets/no-photo.png";
    user.price = profile.data?.price || 0;
    user.start_date = profile.data?.start_date;
    user.height = profile.data?.height;
    user.role = profile.data?.role || "user";
    user.profile_id = profile.data?.id;
    if (!allowedRoles.includes(user.role)) {
      user.role = "user";
    }

    localStorage.setItem("zfitLoggedUser", JSON.stringify(user));
  }
};
