import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";

export function useRoutines(paginate=true) {
  const { params, getData } = useQuery("routines");
  const routines = ref([]);

  const getRoutines = async () => {
    params.searchables = "name,description,goal,advantages";
    params.paginate=paginate;
    const instance = await getData();
    instance.data.length>0?routines.value.push(...instance.data): routines.value=[];
    return instance;
  };

  const onSearch = async () => {
      routines.value = [];
     return  await getRoutines();
    };
  return { params, routines, getRoutines, onSearch };
}

export function useNewRoutine() {
  const routine = reactive({
    name: null,
    description: null,
    duration: null,
    goal: null,
    range: null,
    advantages: null,
    body: null,
    image: null,
  });

  const rules = {
    name: [
      { required: true, message: "Campo requerido" },
      { min: 10, message: "Mínimo 10 caracteres" },
    ],
    description: [
      { required: true, message: "Campo requerido" },
      { min: 25, message: "Mínimo 25 caracteres" },
    ],
    image: [
      { required: true, message: "Campo requerido" },
      { type: 'url', message: "Formato inválido" },
    ],
  };

  const saveRoutine=async()=>{
   const {saveData} = useQuery('routines');
   
   const res=await saveData(routine);
   resetRoutine();
   return res;
  }

  const resetRoutine=()=>{
    Object.keys(routine).forEach((key)=>routine[key]=null)
  }
  return {routine, rules, saveRoutine, resetRoutine}
}
