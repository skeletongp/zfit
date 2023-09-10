import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";
import supabase from "@/utils/supabase";
export function useDiet() {
  const { params, getData } = useQuery("diets");
  params.cols = "*, dietfoods(*)";
  const diets = ref([]);

  const getDiets = async (load = false) => {
    params.paginate = paginate;
    params.searchables = "name,type,goal";
    const instance = await getData(load);
    diets.value.push(...instance.data);
    return instance;
  };

  const onSearch = async () => {
    diets.value = [];
    params.page = 1;
    return await getDiets(false);
  };

  return { diets, params, getDiets, onSearch };
}

export function useNewDiet() {
  const { saveData, deleteData } = useQuery("diets");

  const diet = reactive({
    name: null,
    type: null,
    goal: null,
    proteins: null,
    calories: null,
    privacy: "public",
    dietFoods: [],
  });

  const dietFood=reactive({
    cant: null,
    food_id: null,
  })
  const validateFoods = async (_rule, value) => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return Promise.reject("Faltan alimentos");
    } else {
      return Promise.resolve();
    }
  };

  const rules = {};
  const requireds = ["name", "goal","proteins","calories"];
  requireds.forEach((key) => {
    rules[key] = [{ required: true, message: "El campo es requerido" }];
  });
  rules.type = [
    { type:"enum", enum: ["Desayuno","Almuerzo","Merienda","Cena"], message: "Valor inválido" },
  ];
  rules.privacy = [
    { type:"enum", enum: ["public","private","secret"], message: "Valor inválido" },
  ];
  rules.dietFoods = [
    {
      validator: validateFoods,
      trigger: "change",
    },
  ];

  const rulesFoods ={
    cant:[{required: true, message:"Requerid"}],
    food_id:[{required: true, message:"Requerid"}],
    
  }

  const saveDiet = async () => {
    const dietToSave={};
    Object.assign(dietToSave, diet)
    delete dietToSave.dietFoods;
    const res = await saveData(dietToSave);
    await saveDietFoods(res.id);
    return res;
  };

  const saveDietFoods=async(diet_id)=>{
    const dietFoods = diet.dietFoods;

    dietFoods.forEach(async(food)=>{
      food.diet_id=diet_id;
    })
    const res=await supabase.from("dietfoods").upsert(dietFoods).select();
    if(res.error){
      throw res.error;
    }
  }

  const deleteDiet=async(field, value)=>{
    const res=await deleteData(field, value);
    return res;
  }

  return {diet, rules, dietFood, rulesFoods, saveDiet, deleteDiet};
}
