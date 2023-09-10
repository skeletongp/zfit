import {
  ref,
  reactive
} from "vue";
import {
  useQuery
} from "@/utils/query";
import supabase from "@/utils/supabase";
import {
  getUser
} from "@/utils/auth";
import {
  removeFile
} from "@/utils/parse";

export function useUsers() {
  const {
    params,
    getData,
    findData
  } = useQuery("users");
  const users = ref([]);
  const user = ref({});

  const getUsers = async (paginate = true) => {
    params.paginate = paginate;
    params.searchables = "name,email";
    const instance = await getData();
    users.value.push(...instance.data);
    return instance;
  };

  const findUser = async (value, field) => {
    const instance = await findData(field, value);
    user.value = instance.data;
    return instance;
  };

  const getWeight = async (userId) => {
    const {
      data,
      error
    } = await supabase
      .from("evals")
      .select("measures(*)")
      .eq("user_id", userId)
      .eq("measures.key", "body")
      .order("id", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();
    if (!data) {
      return 404;
    }

    user.value.weight = parseFloat(data.measures[0].value);
    const imc =
      parseFloat(user.value.weight) /
      Math.pow(parseFloat(user.value.height / 100), 2) || 0;
    user.value.imc = imc.toFixed(2);
    return 500;

  };
  const getMeasures = async (userId) => {
    const {
      data,
      error
    } = await supabase
      .from("evals")
      .select("*, measures(*)")
      .eq("user_id", userId)
      .order("id", {
        ascending: false
      })
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      return [];
    } else {
      return data.measures.filter((measure) => measure.key != "body");
    }
  };
  const imcStatus = (imc) => {
    if (!imc) {
      return "N/A"
    } else if (imc < 18.5) {
      return "Bajo peso";
    } else if (imc >= 18.5 && imc <= 24.999) {
      return "Normal";
    } else if (imc >= 25 && imc <= 29.999) {
      return "Sobrepeso";
    } else {
      return "Obesidad";
    }
  };

  return {
    params,
    users,
    getUsers,
    findUser,
    getWeight,
    getMeasures,
    imcStatus,
    user,
  };
}

export function useEditUser() {
  const {
    updateData
  } = useQuery("users");
  const user = reactive({
    id: null,
    name: null,
    address: null,
    start_at: null,
    price: null,
    height: null,
    birthdate: null,
    photo: null,
    email: null,
    role: null,
  });
  const rules = {
    name: [{
      required: true,
      message: "Campo obligatorio"
    }],
    birthdate: [{
      required: true,
      message: "Campo obligatorio"
    }],
  };

  const loadUser = async (prevUser) => {
    Object.keys(user).map((key) => {
      user[key] = prevUser[key];
    });
  };
  const updateUser = async () => {
    const res = await updateData(user);
    await getUser();
    return res;
  };

  const updatePhoto = async (photo, action) => {
    if (!photo) {
      return null;
    }

    if (action == "confirm") {
      return confirmPhoto(photo);
    } else {
      return cancelPhoto(photo);
    }
  };
  const confirmPhoto = async (photo) => {
    try {
      const photoId = user.photo.split("/").pop();
      await removeFile(photoId);
      user.photo = photo;
      const res = await updateData(user);
      await getUser();
      return res;
    } catch (error) {
      const photoId = photo.split("/").pop();
      return await removeFile(photoId);
    }
  };
  const cancelPhoto = async (photo) => {
    const photoId = photo.split("/").pop();
    return await removeFile(photoId);
  };

  return {
    user,
    rules,
    updateUser,
    updatePhoto,
    loadUser
  };
}