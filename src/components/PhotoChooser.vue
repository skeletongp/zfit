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
import { upload } from "@/utils/parse";
import moment from "moment";
const props = defineProps({
  folder: {
    type: String,
    default: "zfit",
  },
  prevPhoto: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["onPhoto"]);

const showButton = ref(false);
const photo = ref("");
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
    const name = moment().unix().toString();
    photo.value = await upload(photoInstance.webPath, name);
    emit("onPhoto", photo.value);
    showButton.value = false;
  } catch (error) {
    console.log(error);
  }
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
