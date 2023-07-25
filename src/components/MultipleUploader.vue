<template>
  <!-- Slot for button -->
  <a-button
    html-type="button"
    class="font-bold rounded-xl w-full ellipsis"
    color="light"
    size="large"
    @click="getPhotos"
  >
    Subir fotos
  </a-button>
</template>

<script setup>
import { Camera, CameraResultType } from "@capacitor/camera";
const emit = defineEmits(["setPhotos"]);
const getPhotos = async () => {
  try {
    const res = await Camera.pickImages({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    //limit res.photos to 4
    const photos= res.photos.slice(0, 5);
    emit("setPhotos", photos);
  } catch (error) {
    return [];
  }
};
</script>
