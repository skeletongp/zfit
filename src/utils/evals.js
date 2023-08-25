import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";
import { message } from "ant-design-vue";
import moment from "moment";
import { upload } from "@/utils/parse";
import supabase from "@/utils/supabase";
export function useEvals() {
  const { params, getData, findData } = useQuery("evals");
  const evals = ref([]);
  const evaluation = ref(null);

  const getEvals = async (paginate = true) => {
    params.paginate = paginate;
    params.searchables = "observation";
    params.orderBy = "id";
    params.ascend = false;
    const instance = await getData();
    instance.data ? evals.value.push(...instance.data) : (evals.value = []);
    return instance;
  };

  const findEval = async (val, key = "id") => {
    params.cols = "*,measures(*),evalphotos(*)";
    const { data } = await findData(key, val);
    evaluation.value = data || null;
  };

  return { params, evals, evaluation, getEvals, findEval };
}

export function useNewEval(userId) {
  const photos = ref([]);
  const { saveData } = useQuery("evals");
  const { params, getEvals } = useEvals();
  const rules = [
    {
      required: true,
      message: "El campo es obligatorio",
    },
  ];
  const evaluation = reactive({
    observation: "",
    date: "",
    user_id: "",
  });

  var measures = reactive([]);

  const isOpen = ref(false);

  const getMeasures = async () => {
    params.limit = 1;
    params.orderBy = "id desc";
    params.ascend = false;
    params.filters = [{ key: "user_id", value: userId }];
    params.cols="measures(*)"
    const {data}=await getEvals(false);
    if(data && data.length>0){
      const msrs=data[0].measures;
      msrs.forEach(measure=>{
        const oldMeasure=measures.find(mes=>mes.name==measure.name);
        if(oldMeasure){
          oldMeasure.value=measure.value;
        }
      })
    }
  };
  const onModalDidPresent = async() => {
    evaluation.user_id = userId;
    evaluation.date = null;
    evaluation.observation = "";
    await getMeasures();
    isOpen.value = true;
  };

  const openModal = () => {
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
  };

  const onModalDidDismiss = () => {
    isOpen.value = false;
  };

  const setPhotos = (newPhotos) => {
    newPhotos.forEach((photo) => {
      photos.value.push(photo);
    });
  };

  const removePhoto = (index) => {
    photos.value.splice(index, 1);
  };

  const saveEvaluation = async () => {
    try {
      const newEval = await saveData(evaluation);
      for (let i = 0; i < measures.length; i++) {
        measures[i].eval_id = newEval.id;
        measures[i].value = parseFloat(measures[i].value);
        delete measures[i].label;
      }
   
      await useQuery("measures").saveData(measures);

      for (let i = 0; i < 4; i++) {
        let photo = photos.value[i];
        if (photo) {
          await storePhotos(newEval.id, photo.webPath);
        }
      }
      closeModal();
    } catch (error) {
      console.log(error);
      message.error("No se pudo registrar la evaluación");
    }
  };

  const storePhotos = async (eval_id, file) => {
    const now = moment().unix();
    const name = `${now}`;
    const url = await upload(file, name);
    await supabase.from("evalphotos").insert([
      {
        path: url,
        eval_id: eval_id,
      },
    ]);
  };

  return {
    evaluation,
    rules,
    photos,
    isOpen,
    openModal,
    closeModal,
    onModalDidDismiss,
    onModalDidPresent,
    setPhotos,
    saveEvaluation,
    removePhoto,
    measures,
  };
}
