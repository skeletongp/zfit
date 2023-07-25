<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-no-padding">
      <div class="w-full h-full bg-primary p-4 flex flex-col" :key="key">
        <!-- Primary Info -->
        <div class="w-full flex flex-col items-center">
          <ion-avatar
            class="mx-auto rounded-full border-2 my-1 border-contrast overflow-hidden !w-20 !h-20"
          >
            <a-image
              :src="user.photo || 'src/assets/no-photo.png'"
              class="rounded-full !w-20 !h-20"
            />
          </ion-avatar>
          <h1 class="font-bold text-xl ellipsis w-full text-center text-white">
            {{ user.name }}
          </h1>
          <h1 class="ellipsis text-sm -mt-2 w-full text-center text-contrast opacity-80">
            {{ user.email }}
          </h1>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 items-center gap-1 mt-4">
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <span class="text-xl font-bold text-white"> {{ user.height || 0 }} Cm.</span>
            <span class="text-sm font-bold text-white"> Estatura </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <div class="h-6 w-[0.75px] bg-gray-200 absolute left-0 top-[37.5%]"></div>
            <div class="h-6 w-[0.75px] bg-gray-200 absolute right-0 top-[37.5%]"></div>
            <span class="text-xl font-bold text-white"> {{ user.weight || 0 }} Kgs.</span>
            <span class="text-sm font-bold text-white"> Peso </span>
          </div>
          <div class="relative w-full h-20 flex flex-col justify-center items-center">
            <span class="text-xl font-bold text-white"> {{ user.imc || 0 }} IMC</span>
            <span class="text-sm font-bold text-white"> {{imcStatus(user.imc)}} </span>
          </div>
        </div>
        <hr class="border-contrast mb-1" />
        <!-- Segments -->
        <ion-segment v-model="viewOpen">
          <ion-segment-button value="body" :class="{ active: isActive('body') }">
            <ion-icon :icon="icon.bodyOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="socials" :class="{ active: isActive('socials') }">
            <ion-icon :icon="icon.linkOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="evals" :class="{ active: isActive('evals') }">
            <ion-icon :icon="icon.scaleOutline"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="edit" :class="{ active: isActive('edit') }">
            <ion-icon :icon="icon.settingsOutline"></ion-icon>
          </ion-segment-button>
        </ion-segment>

        <!-- Body -->
        <div v-if="viewOpen == 'body'" class="w-full h-full">
          <BodyComponent :user="user" />
        </div>
        <!-- Socials -->
        <div v-else-if="viewOpen == 'socials'" class="w-full h-full">
          <SocialComponent :user="user" />
        </div>
        <!-- Evals -->
        <div v-else-if="viewOpen == 'evals'" class="w-full h-full">
          <UserEvals :user="user" />
          <AddEval :user="user" />
        </div>
         <!-- Evals -->
         <div v-else-if="viewOpen == 'edit'" class="w-full h-full">
          <EditUser :user="user" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore, useGeneralStore } from "@/store";
import BodyComponent from "@/components/profile/BodyComponent.vue";
import SocialComponent from "@/components/profile/SocialComponent.vue";
import UserEvals from "@/components/profile/UserEvals.vue";
import AddEval from "@/components/profile/AddEval.vue";
import EditUser from "@/components/profile/EditUser.vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/utils/supabase";
import { message } from "ant-design-vue";
import * as icon from "ionicons/icons";

const route = useRoute();
const router = useRouter();
var user = reactive({});
const viewOpen = ref(null);
const key=ref(0);

const isActive = (view) => {
  return viewOpen.value === view;
};

const getUser = async () => {
  const id = route.params.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("*,contacts(*)")
    .eq("id", id)
    .single();
  if (error) {
    message.error("No se pudo obtener información");
    router.push({ name: "users" });
  }
  user = data;
  user.email = data?.contacts[0].username;
  viewOpen.value = "body";
};

const getWeight = async () => {
  const { data, error } = await supabase
    .from("evals")
    .select("measures(*)")
    .eq("profile_id", user.id)
    .eq("measures.key", "body")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (data?.measures?.length > 0) {
    user.weight = parseFloat(data.measures[0].value);
    const imc = parseFloat(user.weight) / Math.pow(parseFloat(user.height/100), 2);
    user.imc = imc.toFixed(1);
    console.log(user)
  }
};
const imcStatus=(imc)=>{
  if(imc<18.5){
    return "Bajo peso";
  }else if(imc>=18.5 && imc<=24.9){
    return "Normal";
  }else if(imc>=25 && imc<=29.9){
    return "Sobrepeso";
  }else if(imc>=30){
    return "Obesidad";
  }
}
onMounted(async () => {
  await getUser();
  await getWeight();
  key.value=new Date().getTime();
});
</script>

<style scoped>
.active {
  @apply text-contrast opacity-75;
}
</style>
