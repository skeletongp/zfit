<template>
  <ion-item
    class="border rounded-md border-gray-600 ion-no-padding"
    v-if="!$slots.default"
  >
    <ion-avatar slot="end" class="w-5 h-5" v-if="photo">
      <a-image :src="photo" class="rounded-full w-5 h-5" />
    </ion-avatar>
    <a-button html-type="button" class="w-full" color="light" @click="takePhoto">
      <div class="w-full ellipsis">Seleccionar foto</div>
    </a-button>
  </ion-item>
  <a-button
    v-else
    html-type="button"
    class="w-full"
    color="light"
    type="text"
    @click="takePhoto"
  >
    <slot />
  </a-button>
</template>

<script setup>
import { ref, onBeforeMount, watch } from "vue";
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

  name: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["onPhoto"]);
const showButton = ref(false);
const photo = ref(null);
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
    const name = props.name || moment().unix().toString();
    photo.value = await upload(photoInstance.webPath, name, true);
    emit("onPhoto", photo.value);
    showButton.value = false;
  } catch (error) {
    console.log(error);
  }
};

onBeforeMount(async () => {
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
