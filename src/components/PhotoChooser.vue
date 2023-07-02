<template>
  <ion-item>
    <div class="image-container my-2 p-0 w-full">
      <ion-img
        class="!max-h-[15rem]"
        :src="photo"
        @click="showButton = !showButton"
      ></ion-img>
      <ion-button size="large" class="overlay-button" v-if="showButton" @click="takePhoto"
        >Selecciona una foto</ion-button
      >
    </div>
  </ion-item>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, watch } from "vue";
import { Camera, CameraResultType } from "@capacitor/camera";
import { supabase } from "@/utils/supabase";
import moment from "moment";
const props = defineProps({
  folder: {
    type: String,
    default: "agio",
  },
  prevPhoto: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["onPhoto"]);

const showButton = ref(false);
const photo = ref("");
const file = ref(null);
const openFileChooser = ref(false);

const takePhoto = async () => {
  try {
    photo.value = "src/assets/no-photo.png";
    openFileChooser.value = false;
    const photoInstance = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: "Camera",
    });
    photo.value = photoInstance.webPath;
    const fileInstance = await pathToFile(photo.value);
    await uploadImage(fileInstance);
    showButton.value = false;
  } catch (error) {
    console.log(error);
  }
};

const uploadImage = async (file) => {
  const now = moment().unix();
  const name = props.folder + now;

  const { data, error } = await supabase.storage.from("agio_storage").upload(name, file);
  if (error) {
    console.log(error);
  } else {
    const res = await supabase.storage.from("agio_storage").getPublicUrl(name);
    emit("onPhoto", res.publicURL);
  }
};

const pathToFile = async (path) => {
  const file = await fetch(path);
  const blob = await file.blob();
  const fileBlob = new File([blob], "image.jpg", { type: "image/jpeg" });
  return fileBlob;
};
const onModalDidPresent = async () => {
  await takePhoto();
};
onMounted(async () => {
  photo.value = props.prevPhoto || "src/assets/no-photo.png";
});
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.overlay-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.image-container:hover .overlay-button,
.image-container:focus-within .overlay-button {
  opacity: 1;
}
</style>
