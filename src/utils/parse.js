import moment from "moment/moment";
import supabase from "./supabase";
import { loadingController } from "@ionic/vue";
const getPagination = (page, size) => {
  const from = page ? (page - 1) * size : 0;
  const to = page ? (from + size)-1 : size-1;

  return { from, to };
};

const filterOption = (input, option) => {
  const haystack = option.label.toString();
  const needle = input.toString();
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0;
};

const upload = async (file, filename) => {
  if(typeof file=="string" && file.includes('data:')){
    file=dataURLtoFile(file, filename);
    
  }
  const name = filename;
  await supabase.storage
    .from("zfit_storage")
    .upload(name, file);
    const {
      data: { publicUrl },
    } = supabase.storage.from("zfit_storage").getPublicUrl(name);
    return publicUrl;
};
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

const ionLoading = async () => {
  const loading = await loadingController.create({
    message: 'Cargando...',
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

export { getPagination, filterOption, upload, ionLoading, formatMoney};
