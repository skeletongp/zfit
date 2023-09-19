import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";
import nutrients from "@/vars/nutrients";
export function useNewFood() {
  const { saveData, params } = useQuery("foods");
  const food = reactive({
    name: null,
    group: null,
  });
  const rules = {
    name: [
      { required: true, message: "El campo es requerido" },
      { min: 4, message: "Mínimo 4 caracteres" },
    ],
    group: [
      { required: true, message: "El campo es requerido" },
      { min: 4, message: "Mínimo 4 caracteres" },
    ],
  };
  nutrients.forEach((nut) => {
    food[nut.name] = 0;
  });
  nutrients.forEach((nut) => {
    rules[nut.name] =  [{ required: true, message: "Requerido" }]
  });
  const groups = [
    { label: "Carnes", value: "Carnes" },
    { label: "Cereales", value: "Cereales" },
    { label: "Dulces", value: "Dulces" },
    { label: "Grasas", value: "Grasas" },
    { label: "Huevos", value: "Huevos" },
    { label: "Lácteos", value: "Lácteos" },
    { label: "Otros", value: "Otros" },
    { label: "Vegetales", value: "Vegetales" },
  ];

  const saveFood = async () => {
    const res = await saveData(food);
    return res;
  };
  const updateFood = async () => {
    const { updateData } = useQuery("foods");
    const res = await updateData(food);
    return res;
  };

  const deleteFood = async (value, field ) => {
    const { deleteData } = useQuery("foods");
    const res = await deleteData(field, value);
    return res;
  };

  const resetFood = () => {
    Object.keys(food).forEach((key) => (food[key] = null));
    nutrients.forEach((nut) => {
      food[nut.name]=0;
    });
    food["Calorías"]=0;
    food["Proteínas"]=0;
  };

  return { food, rules, nutrients, groups, saveFood, resetFood, updateFood, deleteFood };
}

export function useFoods(paginate = true) {
  const { params, getData } = useQuery("foods");
  const foods = ref([]);
  const getFoods = async (load = false) => {
    params.paginate = paginate;
    params.searchables = "name,group";
    const instance = await getData(load);
    foods.value.push(...instance.data) ;
    return instance;
  };

  const orderables = [
    { label: "Default", value: "id" },
    { label: "Nombre", value: "name" },
    { label: "Proteínas", value: "Proteínas" },
    { label: "Calorías", value: "Calorías" },
    { label: "Carbohidratos", value: "Carbohidratos" },
  ];
  const { groups } = useNewFood();
  groups.unshift({ label: "Todos", value: null });
  const onSearch = async () => {
    foods.value = [];
    params.page = 1;
    return await getFoods(false);
  };
  const onOrderBy = async (val) => {
    if (params.orderBy == val) {
      params.ascend = !params.ascend;
    } else {
      params.orderBy = val;
      params.ascend = true;
    }
    foods.value = [];
    params.page = 1;
    return await getFoods();
  };
  const onFilterGroup = async (val) => {
    if (val) {
      params.filters = [{ key: "group", value: val }];
    } else {
      params.filters = [];
    }
    foods.value = [];
    params.page = 1;
    return await getFoods();
  };

  
  return {
    params,
    foods,
    getFoods,
    onSearch,
    onOrderBy,
    orderables,
    groups,
    onFilterGroup,
  };
}


