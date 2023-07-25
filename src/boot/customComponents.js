import SvgIcon from "@/components/SvgIcon.vue";
import PhotoChooser from "@/components/PhotoChooser.vue";
import { Swiper, SwiperSlide } from 'swiper/vue';
import MultipleUploader from "@/components/MultipleUploader.vue";
import EmptyCard from "@/components/EmptyCard.vue";

function setCustom(app) {
  app.component("SvgIcon", SvgIcon);

  app.component("PhotoChooser", PhotoChooser);
  app.component("SwiperBody", Swiper);
  app.component("SwiperSlide", SwiperSlide);
  app.component("MultipleUploader", MultipleUploader);
  app.component("EmptyCard", EmptyCard);
 
}

export default setCustom;