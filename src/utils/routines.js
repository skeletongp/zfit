import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";

export function useRoutines(paginate=true) {
  const { params, getData, findData } = useQuery("routines");
  const routines = ref([]);
  const routine= ref(null);

  const getRoutines = async (load=true) => {
    params.searchables = "name,description,goal,advantages";
    params.paginate=paginate;
    const instance = await getData(load);
    routines.value.push(...instance.data);
    return instance;
  };
  const findRoutine = async (value, field) => {
    const instance = await findData(field, value);
    routine.value = instance.data;
    return instance;
  };

  const onSearch = async () => {
      routines.value = [];
     return  await getRoutines(false);
    };
  return { params, routines, getRoutines, findRoutine, routine, onSearch };
}

export function useNewRoutine() {
  const routine = reactive({
    name: null,
    description: null,
    image: null,
    duration: null,
    goal: null,
    range: null,
    body: null,
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
    duration: [{ required: true, message: "Campo requerido" }],
    goal: [{ required: true, message: "Campo requerido" }],
    range: [{ required: true, message: "Campo requerido" }],
    body: [{ required: true, message: "Campo requerido" }],
  };

  const saveRoutine=async()=>{
   const {saveData} = useQuery('routines');
   
   const res=await saveData(routine);
   resetRoutine();
   return res;
  }

  const deleteRoutine = async (value, field) => {
    const { deleteData } = useQuery("routines");
    const res = await deleteData(field, value);
    return res;
  };
  const updateRoutine = async () => {
    const { updateData } = useQuery("routines");
    const res = await updateData(routine);
    return res;
  };
  const resetRoutine=()=>{
    Object.keys(routine).forEach((key)=>routine[key]=null)
  }
  return {routine, rules, saveRoutine, deleteRoutine, resetRoutine, updateRoutine}
}
