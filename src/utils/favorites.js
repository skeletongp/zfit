import { ref, reactive } from "vue";
import { useQuery } from "@/utils/query";
import { message } from "ant-design-vue";

export function useFavorites(userId, paginate = true) {
  const favorites = ref([]);
  const favorite = ref(null);
  const { getData, findData, params } = useQuery("favorites");

  const getFavorites = async () => {
    params.filters = [{ key: "user_id", value: userId }];
    params.paginate = paginate;
    params.perPage = 25;
    const instance = await getData();
    instance.data.length > 0
      ? favorites.value.push(...instance.data)
      : (favorites.value = []);
    return instance;
  };

  const findFavorite = async (value, field = "id") => {
    const instance = await findData(field, value);
    favorite.value = instance.data;
    return instance;
  };

  const checkIsFavorite = async (fave_id, fave_type) => {
    params.filters = [
      { key: "user_id", value: userId },
      { key: "fave_id", value: fave_id },
      { key: "fave_type", value: fave_type },
    ];
    params.limit=1;
    const instance=await getData();
    params.filters=[];
    params.limit=0;
    if(instance.data.length > 0){
        return instance.data[0].id
    }else{
        return null;
    }
  };
  return { favorites, favorite, getFavorites, params, findFavorite, checkIsFavorite };
}

export function useSetFavorite(userId) {
  const { saveData, deleteData } = useQuery("favorites");
  const favorite = reactive({
    user_id: userId,
    title: null,
    fave_type: null,
    fave_id: null,
    image: "https://res.cloudinary.com/atriontechsd/image/upload/v1689827462/not_found_zl8ljy.png"
  });

  const validate = async () => {
    const isValid= ! Object.keys(favorite).some((key)=> !favorite[key])
    if(!isValid){
      message.warning('Hay un error en algunos campos');
    }
    return isValid;
    
  };

  const saveFavorite = async () => {
    const isValid = await validate();
    if (isValid) {
      const instance = await saveData(favorite, false);
      message.success('Añadido a favorito')
      console.log(instance)
      return instance;
    }
    return null;
  };

  const removeFavorite=async(id)=>{
    const instance=await deleteData('id',id)
  }

  return { favorite, saveFavorite, removeFavorite };
}
