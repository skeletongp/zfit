import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";

export function useUsers() {
  const { params, getData, findData } = useQuery("users");
  const users = ref([]);

  const getUsers = async (paginate = true) => {
    params.paginate = paginate;
    params.searchables = "name,email";
    const instance = await getData();
    instance.data ? users.value.push(...instance.data) : (users.value = []);
    return instance;
  };

  const findUser = async (value, field = id) => {
    const instance = await findData(field, value);
    return instance;
  };

  return { params, users, getUsers, findUser };
}

export function useNewUser() {
  const { saveData } = useQuery("users");
  
}
