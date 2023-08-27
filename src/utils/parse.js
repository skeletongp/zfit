import moment from "moment/moment";
import supabase from "./supabase";
import { loadingController } from "@ionic/vue";
const getPagination = (page, size) => {
  var from = page ? (page - 1) * size : 0;
  var to = size ? from + size - 1 : 9;
 
  return { from, to };
};

const filterOption = (input, option) => {
  const haystack = option.label.toString();
  const needle = input.toString();
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

const onSuggest=(options, val)=>{
  options=options.map(opt=>{return {label: opt}})
 return options.filter(opt=>filterOption(val, opt))
}

const upload = async (filePath, name, upsert=false ) => {
  const loading = await ionLoading();
  var blob = filePath;
    blob= await getBlobFromPath(filePath);
  const { data, error } = await supabase.storage
    .from("zfit_storage")
    .upload(name, blob,{
      upsert: upsert
    });
  if (error) {
    loading.dismiss();
    return error;
  } else {
    loading.dismiss();
    return import.meta.env.VITE_STORAGE_BASE_URL+name
  }
};

const removeFile=async(fileId)=>{
 
  fileId=Array.isArray(fileId) ? fileId: [fileId];
  const res=await supabase.storage.from("zfit_storage").remove(fileId);
  return res;
}
async function getBlobFromPath(path) {
  const response = await fetch(path);
  const blob = await response.blob();
  return blob
}
const ionLoading = async () => {
  const loading = await loadingController.create({
    message: "Cargando...",
  });

  loading.present();
  return loading;
};
const formatMoney = (number) => {
  number = parseFloat(number);
  if (isNaN(number)) {
    return "$" + "0";
  }
  return "$" + number.toLocaleString("en-US");
};

const patterns={
    mustLower:/.*[a-z]/g,
    mustUpper:/.*[A-Z]/g,
    mustDigit:/.*[0-9]/g,
    mustLength:/.{min,max}/g,
  
}

export { getPagination, filterOption, onSuggest, upload, removeFile, ionLoading, formatMoney, patterns};
