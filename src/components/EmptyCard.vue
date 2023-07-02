<template>
  <ion-list class="px-4">
    <ion-list-header>
      <ion-skeleton-text
        :animated="true"
        style="width: 100%; height: 20px"
      ></ion-skeleton-text>
    </ion-list-header>
    <ion-item>
      <ion-thumbnail slot="start" style="--border-radius: 50%; --size: 5rem">
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 15px"
          ></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "ClientCard",
  components: {},

  setup(props, context) {
    return {};
  },
});
</script>
