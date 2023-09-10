import {  reactive } from "vue";
import supabase from "@/utils/supabase"
import {patterns} from "@/utils/parse"
import { message } from "ant-design-vue";
export function useResetPassword() {
    const user = reactive({
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
      password: [
        { required: true, message: "Campo requerido" },
        { min: 8, message: "Mínimo 8 caracteres" },
        {
          pattern: patterns.mustLower,
          message: "Debe contener minúsculas",
        },
        {
          pattern: patterns.mustUpper,
          message: "Debe contener mayúsculas",
        },
        {
          pattern: patterns.mustDigit,
          message: "Debe contener dígitos",
        },
      ],
      password_confirmation: [
        { required: true, message: "Campo requerido" },
        { min: 8, message: "Mínimo 8 caracteres" },
        {
          pattern: patterns.mustLower,
          message: "Debe contener minúsculas",
        },
        {
          pattern: patterns.mustUpper,
          message: "Debe contener mayúsculas",
        },
        {
          pattern: patterns.mustDigit,
          message: "Debe contener dígitos",
        },
        {
          validator: validateConfirm,
          trigger: "change",
        },
      ],
    };
    const resetPassword = async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: user.password,
      });
      if (!error) {
        message.success("Contraseña cambiada");
        user.password = null;
        user.password_confirmation = null;
        return 200;
      } else {
        if (JSON.stringify(error).includes("different")) {
          message.error("La contraseña no puede ser igual a la anterior");
          return 500;
        }
        message.error("Ha ocurrido un error con su solicitud");
        return  500;
      }
    };
  
    return { user, rules, resetPassword };
  }
  