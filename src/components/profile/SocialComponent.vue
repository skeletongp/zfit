<template>
  <div class="relative">
    <a-form
      :model="newSocial"
      @finish="storeSocial(user.id)"
      name="newSocial"
      class="w-full grid grid-cols-8 gap-4 transition-all ease-in-out duration-1000"
      :class="isShow ? 'show' : 'hide'"
    >
      <a-form-item name="name" :rules="rules" class="col-span-3">
        <a-select
          class="!w-full text-white rounded-xl"
          :options="providers"
          v-model:value="newSocial.name"
          placeholder="Red Social"
        >
          <template #menuItemSelectedIcon>
            <ion-icon :icon="icon.checkmarkDoneOutline" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item name="username" :rules="rules" class="col-span-4">
        <a-input
          v-if="newSocial.name == 'email'"
          class="bg-transparent text-white"
          type="email"
          v-model:value="newSocial.username"
          placeholder="Correo"
        />
        <a-input
          v-else-if="newSocial.name == 'whatsapp'"
          class="bg-transparent text-white"
          type="number"
          v-model:value="newSocial.username"
          placeholder="No. Telefónico"
        />
        <a-input
          v-else
          class="bg-transparent text-white"
          type="text"
          v-model:value="newSocial.username"
          placeholder="Usuario"
        />
      </a-form-item>
      <a-form-item name="btn" class="col-span-1">
        <a-input
          class="bg-transparent text-white text-2xl p-0 border-none"
          type="submit"
          value="+"
          placeholder="Usuario"
        />
      </a-form-item>
    </a-form>
    <ion-button
      v-if="isMyProfile"
      fill="clear"
      style="--color: #ffe024"
      class="absolute top-8 right-0 z-20"
      @click="isShow = !isShow"
    >
      <ion-icon :icon="isShow ? icon.closeCircleOutline : icon.addCircle" />
    </ion-button>
  </div>
  <ion-list
    v-if="socials.length > 0"
    :key="socials.length + 'list'"
    class="space-y-4 mt-6"
  >
    <template v-for="social in socials" :key="social.id">
      <ion-popover
        v-if="social.name != 'Email'"
        :trigger="`social_action_${social.id}`"
        trigger-action="click"
      >
        <ion-button @click="deleteSocial(social.id)">
          <ion-icon slot="start" :icon="icon.trashBinOutline" class="text-white" />
          Eliminar
        </ion-button>
      </ion-popover>
      <ion-item class="relative">
        <div slot="start" class="flex space-x-2 items-center">
          <ion-icon
            :id="`social_action_${social.id}`"
            :icon="icon.ellipsisVerticalOutline"
            :disabled="social.name == 'Email'"
            class="text-gray-300"
          />
        </div>
        <div class="flex items-center space-x-1">
          <ion-icon :icon="icon[social.icon]" class="text-white" />
          <ion-label class="uppercase font-bold">{{ social.name }}:</ion-label>
        </div>
        <a
          class="text-contrast opacity-80 ellipsis max-w-[11rem]"
          :href="social.url"
          slot="end"
          >{{ social.username }}</a
        >
      </ion-item>
    </template>
  </ion-list>
</template>

<style scoped>
.hide {
  @apply transform -translate-x-[110%] opacity-0;
}
.show {
  @apply transform translate-x-0 opacity-100;
}
</style>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import * as icon from "ionicons/icons";
import { useSocial } from "@/utils/users";

const {
  socials,
  isShow,
  rules,
  newSocial,
  storeSocial,
  deleteSocial,
  getSocials,
  providers,
} = useSocial();

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isMyProfile: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  await getSocials(props.user.id);
});

watch(
  () => newSocial.name,
  async (val) => {
    if (val) {
      const selected = providers.find((item) => item.value == newSocial.name);
      newSocial.icon = selected.icon;
      newSocial.url = selected.url;
      newSocial.username = "";
      newSocial.label = selected.label;
    }
  }
);
</script>
