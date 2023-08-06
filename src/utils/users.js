import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";
import supabase from "@/utils/supabase";
import { providers, validate } from "@/vars/socialVars";
import { message } from "ant-design-vue";
import { presentConfirm } from "@/utils/helper";

export function useUsers() {
  const { params, getData, findData } = useQuery("users");
  const users = ref([]);
  const user = ref({});

  const getUsers = async (paginate = true) => {
    params.paginate = paginate;
    params.searchables = "name,email";
    const instance = await getData();
    instance.data ? users.value.push(...instance.data) : (users.value = []);
    return instance;
  };

  const findUser = async (value, field = "id") => {
    const instance = await findData(field, value);
    user.value = instance.data;
    return instance;
  };

  const getWeight = async (userId) => {
    const { data, error } = await supabase
      .from("evals")
      .select("measures(*)")
      .eq("user_id", userId)
      .eq("measures.key", "body")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.measures?.length > 0) {
      user.weight = parseFloat(data.measures[0].value);
      const imc = parseFloat(user.weight) / Math.pow(parseFloat(user.height / 100), 2);
      user.imc = imc.toFixed(2);
    }
  };
  const getMeasures = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("evals")
        .select("*, measures(*)")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.log(error);
        return []
      } else {
       return data?.measures.filter((measure) => measure.key != "body")||[];
      }
    } catch (error) {
      return;
    }
  };
  const imcStatus = (imc) => {
    if (imc < 18.5) {
      return "Bajo peso";
    } else if (imc >= 18.5 && imc <= 24.9) {
      return "Normal";
    } else if (imc >= 25 && imc <= 29.9) {
      return "Sobrepeso";
    } else if (imc >= 30) {
      return "Obesidad";
    }
  };

  return { params, users, getUsers, findUser, getWeight, getMeasures, imcStatus, user };
}

export function useSocial(){
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
          const { data, error } = await supabase.from("contacts").delete().eq("id", id);
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

  return {socials, isShow, rules, newSocial, storeSocial, deleteSocial, getSocials, providers}
}
