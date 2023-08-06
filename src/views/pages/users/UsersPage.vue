<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-searchbar
          :debounce="400"
          placeholder="Buscar..."
          v-model="params.search"
          @ionInput="handleSearch"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list lines="full" class="space-y-4" v-if="users.length > 0">
        <template v-for="user in users" key="user.id">
          <ion-item color="dark" :detail="true" class="border-b border-gray-600">
            <ion-avatar class="w-12 h-12 rounded-full" slot="start">
              <a-image
                class="w-12 h-12 rounded-full"
                :src="user.photo || 'src/assets/no-photo.png'"
              />
            </ion-avatar>
            <ion-nav-link
              class="flex flex-col w-full"
              :router-link="`/pages/users/${user.id}`"
            >
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
        <ion-infinite-scroll v-if="users.length > 9" @ionInfinite="onPaginate">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-list>
      <empty-card v-else />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted } from "vue";
import { useUsers } from "@/utils/users";
const { users, params, getUsers } = useUsers();

const getFromUsers = async (reset) => {
  params.cols = "*, contacts(*)";
  if (reset) {
    users.value = [];
  }
  const userInstance = await getUsers();
};

const handleSearch = async (evt) => {
  const srch = evt.detail.value;
  params.search = srch;
  await getFromUsers(true);
};

const onPaginate = async (ev) => {
  params.page = params.page + 1;
  await getFromUsers();
  setTimeout(() => ev.target.complete(), 500);
};

onMounted(async () => {
  await getFromUsers();
});
</script>
