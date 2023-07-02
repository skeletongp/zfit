<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div
        class="h-full w-full bg-no-repeat bg-top bg-cover flex items-end"
        style="background-image: url('src/assets/login_back.png')"
      >
        <div class="h-[30%] w-full rounded-t-[3rem] bg-black flex flex-col space-y-8 p-4">
          <h1 class="text-center text-2xl font-bold text-white flex flex-col space-y-2">
            <span class="text-contrast">Bienvenido(a) a</span>
            <span class="text-5xl">Zaitama Fitness</span>
          </h1>
          <div class="flex justify-between items-center px-4">
            <LoginComponent />
            <SignupComponent />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import LoginComponent from '@/components/auth/LoginComponent.vue';
import SignupComponent from '@/components/auth/SignupComponent.vue';
</script>
