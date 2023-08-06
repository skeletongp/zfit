import { ref, reactive } from "vue";
import supabase from "@/utils/supabase";
import { getPagination } from "@/utils/parse";
import { message } from "ant-design-vue";
import { loadingController } from "@ionic/vue";

export function useQuery(table = "none") {
  const params = reactive({
    page: 1,
    perPage: 10,
    search: "",
    orderBy: "id",
    ascend: true,
    limit: 0,
    cols: "*",
    paginate: false,
    searchables: null,
    filters:[],
  });

  const getData = async () => {
    const { from, to } = getPagination(params.page, params.perPage);
    let instance = supabase
      .from(table)
      .select(params.cols)
      .order(params.orderBy||'id', { ascending: params.ascend })
      
    if (params.search && params.searchables) {
      instance = search(instance, params.searchables, params.search);
    }
    if (params.paginate && !params.limit) {
      instance = instance.range(from, to);
    }
    if(params.limit && !params.paginate){
      instance = instance.limit(params.limit||0);
    }
    if(params.filters && params.filters.length>0){
      params.filters.map((filt)=>{
        instance=instance.eq(filt.key,filt.value )
      })
    }
    instance = await instance;
    return instance;
  };

  const findData = async (key, value) => {
    const user = await getUser();
    const instance = await supabase
      .from(table)
      .select(params.cols)
      .eq(key, value)
      .single();
    return instance;
  };

  const saveData = async (values) => {
    const loading = await showLoading();
    const { data, error } = await supabase.from(table).upsert(values).select();
    message.config({
      top: "200px",
    });
    if (error) {
      message.error("Ha ocurrido un error con el registro");
      loading.dismiss();
      return error;
    } else {
      message.success("Datos registrados exitosamente");
      loading.dismiss();
      return data[0];
    }
  };
  const updateData = async (values) => {
    const loading = await showLoading();
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq("id", values.id)
      .select();
    message.config({
      top: "200px",
    });
    if (error) {
      message.error("Ha ocurrido un error con la actualización");
      loading.dismiss();

      return error;
    } else {
      message.success("Datos actualizados exitosamente");
      loading.dismiss();
      return data[0];
    }
  };
  const search = (instance, cols, query) => {
    let stm = "";
   if(query.length>1){
    const columns = cols.split(",");
    const textcols = query.split(" ");
    textcols.forEach((text) => {
      if (text && text != " " && text.length > 1) {
        columns.forEach((col) => {
          stm += `${col}.ilike.%${text}%,`;
        });
      }
    });
    instance = instance.or(stm.slice(0, -1));
   }
    return instance;
  };
  const deleteData = async (key, value) => {
    const instance = await supabase
      .from(table)
      .delete()
      .eq(key, value)
    return instance;
  };

  const getUser = async () => {
    var user = null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user = session?.user;
    return user || {};
  };

  return { params, getData, findData, saveData, updateData, deleteData };
}

const showLoading = async () => {
  const loading = await loadingController.create({
    message: "Cargando...",
  });

  loading.present();
  return loading;
};
