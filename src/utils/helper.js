import { alertController } from "@ionic/vue";
import { loadingController } from "@ionic/vue";
import { ref } from "vue";
const presentConfirm = async (
  header,
  subheader,
  message,
  buttons = ["Ok"]
) => {
  const alert = await alertController.create({
    header: header,
    subHeader: subheader,
    message: message,
    buttons: buttons,
  });
  await alert.present();
  return alert;
};
/* 
const pageRange = (page, perpage) => {
  const from = (page - 1) * perpage;
  const to = perpage * page - 1;
  return [from, to];
}; */

/* const pathToFile = async (path) => {
  const file = await fetch(path);
  const blob = await file.blob();
  const fileBlob = new File([blob], "image.jpg", { type: "image/jpeg" });
  return fileBlob;
}; */
const loading = async (state = true, message = "Cargando...") => {
  const loadingElement = document.querySelector("ion-loading");
  var returnElement = null;
  if (loadingElement) {
    loadingElement.dismiss();
    returnElement = loadingElement;
  } else {
    const loading = await loadingController.create({
      message,
      duration: 0,
    });
    loading.present();
    returnElement = loading;
  }
  return returnElement;
};

export function useModal() {
  const isOpen = ref(false);
  const onModalDidPresent = async () => {
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

  return {
    isOpen,
    openModal,
    closeModal,
    onModalDidDismiss,
    onModalDidPresent,
  };
}
export { presentConfirm, loading };
