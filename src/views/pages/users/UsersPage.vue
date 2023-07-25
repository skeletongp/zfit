<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-searchbar
          debounce="300"
          placeholder="Buscar..."
          v-model="params.search"
          @ionInput="handleSearch"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list lines="full" class="space-y-4">
        <template v-for="user in users" key="user.id">
          <ion-item color="dark" :detail="true" class="border-b border-gray-600">
            <ion-avatar class="w-12 h-12 rounded-full" slot="start">
              <a-image
                class="w-12 h-12 rounded-full"
                :src="user.photo || 'src/assets/no-photo.png'"
              />
            </ion-avatar>
            <ion-nav-link class="flex flex-col  w-full" :router-link="`/pages/users/${user.id}`">
              <h1 class="uppercase font-bold text-lg">{{ user.name }}</h1>
              <h1 class="text-sm text-contrast opacity-80">
                {{ user.contacts[0].username }}
              </h1>
              <span class="text-xs absolute top-1 right-5">
                {{
                  user.role == "admin"
                    ? "Admin"
                    : user.role == "client"
                    ? "Cliente"
                    : "Invitado"
                }}
              </span>
            </ion-nav-link>
          </ion-item>
        </template>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { supabase } from "@/utils/supabase";
import { message } from "ant-design-vue";
import { pageRange } from "@/utils/helper";
const users = ref([]);
const params = reactive({
  page: 1,
  perpage: 10,
  search: null,
});

const getUsers = async (reset) => {
  var userInstance = supabase
    .from("profiles")
    .select("*, contacts(*)")
    .order("name", { ascending: true })
    .range(...pageRange(params.page, params.perpage));
  if (params.search) {
    userInstance = userInstance.ilike("name", `%${params.search}%`);
  }

  userInstance = await userInstance;
  if (reset) {
    users.value = [];
  }
  users.value.push(...userInstance.data);
  console.log(userInstance);
};

const handleSearch = async (evt) => {
  const srch = evt.detail.value;
  params.search = srch;
  params.page = 1;
  await getUsers(true);
};

onMounted(async () => {
  await getUsers();
});
</script>
