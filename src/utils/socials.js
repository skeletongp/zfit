import { ref, reactive } from "vue";
import { providers, validate } from "@/vars/socialVars";
import supabase from "@/utils/supabase";
import { message } from "ant-design-vue";

export function useSocial() {
    const socials = ref([]);
    const isShow = ref(false);
  
    const rules = [{ required: true, message: "Campo requerido" }];
    const newSocial = reactive({
      name: null,
      icon: "",
      username: "",
      url: "",
    });
  
    const storeSocial = async (userId) => {
      const isValid = validate(newSocial.name, newSocial.username);
      if (!isValid) {
        message.error("Formato no válido");
        return;
      }
      const contact = await supabase.from("contacts").insert([
        {
          user_id: userId,
          name: newSocial.label,
          url: newSocial.url + newSocial.username,
          username: newSocial.username,
          icon: newSocial.icon,
        },
      ]);
      if (contact.error) {
        message.error("Error al crear cuenta");
        return;
      } else {
        message.success("Cuenta creada");
        await getSocials(userId);
        newSocial.name = null;
        newSocial.icon = "";
        newSocial.username = "";
        newSocial.url = "";
      }
    };
  
    const deleteSocial = async (id) => {
      presentConfirm("Eliminar cuenta", "¿Desea eliminar esta cuenta?", "", [
        {
          text: "Cancelar",
          handler: async () => {
            return;
          },
        },
        {
          text: "Proceder",
          handler: async () => {
            const { data, error } = await supabase
              .from("contacts")
              .delete()
              .eq("id", id);
            if (error) {
              message.error("No se pudo remover la cuenta");
              return;
            }
            message.success("Cuenta removida exitosamente");
            await getSocials();
          },
        },
      ]);
    };
  
    const getSocials = async (userId) => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        return;
      } else {
        socials.value = data;
      }
    };
  
    return {
      socials,
      isShow,
      rules,
      newSocial,
      storeSocial,
      deleteSocial,
      getSocials,
      providers,
    };
  }
  