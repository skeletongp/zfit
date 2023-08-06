import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";

export function useFoods(paginate=true) {
  const { params, getData } = useQuery("foods");
  const foods = ref([]);
  const getFoods = async () => {
    params.paginate=paginate;
    params.searchables = "name,group";
    const instance = await getData();
    instance.data
      ? foods.value.push(...instance.data)
      : (foods.value = []);
    return instance;
  };

  const orderables=[
    {label:"Default",value: null},
    {label:"Nombre",value: "name"},
    {label:"Proteínas",value: "proteins"},
    {label:"Calorías",value: "calories"},
  ]
  const {groups}=useNewFood();
  groups.unshift({label: "Todos", value: null})
  const onSearch = async () => {
    foods.value = [];
    return await getFoods();
  };
  const onOrderBy = async (val) => {
    if(params.orderBy==val){
      params.ascend=!params.ascend;
    } else{
      params.orderBy = val;
      params.ascend=true;
    }
    foods.value = [];
    return await getFoods();
  };
  const onFilterGroup=async(val)=>{
    if(val){
      params.filters=[{key: "group", value: val}]
    } else{
      params.filters=[]
    }
    foods.value = [];
    return await getFoods();
  }
  return { params, foods, getFoods, onSearch, onOrderBy, orderables, groups, onFilterGroup };
}

export function useNewFood() {
  const { saveData } = useQuery("foods");
  const food = reactive({
    name: null,
    group: null,
    proteins: null,
    calories: null,
    unit: null,
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
    unit: [{ required: true, message: "Requerido" }],
    proteins: [{ required: true, message: "El campo es requerido" }],
    calories: [{ required: true, message: "El campo es requerido" }],
  };

  const units=[
    {label: "100 g", value:"100 g"},
    {label: "100 ml", value:"100 ml"},
  ]
  const groups=[
    {label: "Carnes", value:"Carnes"},
    {label: "Cereales", value:"Cereales"},
    {label: "Frutas", value:"Frutas"},
    {label: "Frutos Secos", value:"Frutos Secos"},
    {label: "Grasas", value:"Grasas"},
    {label: "Huevos", value:"Huevos"},
    {label: "Lácteos", value:"Lácteos"},
    {label: "Legumbres", value:"Legumbres"},
    {label: "Otros", value:"Otros"},
    {label: "Pescados", value:"Pescados"},
    {label: "Quesos", value:"Quesos"},
    {label: "Verduras", value:"Verduras"},
  ]

  const saveFood = async () => {
    const { saveData } = useQuery("foods");
    const res = await saveData(food);
    if(res){
      resetFood();
    }
    return res;
  };
  const updateFood = async () => {
    const { updateData } = useQuery("foods");
    const res = await updateData(food);
    return res;
  };

  const deleteFood = async (value, field=id) => {
    const { deleteData } = useQuery("foods");
    const res = await deleteData(field, value);
    return res;
  };

  const resetFood = () => {
    Object.keys(food).forEach((key) => (food[key] = null));
  };

  return { food, rules, units, groups, saveFood, resetFood, updateFood, deleteFood };
}
