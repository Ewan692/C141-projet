<template>
  <v-app>
    <!-- Barre de navigation -->
    <app-header />

    <v-main>
      <RouterView />
    </v-main>

    <app-footer />
  </v-app>
</template>

<script setup>
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import { onMounted } from "vue";
import { useGameStore } from "@/stores/gameStore.js";

// Initialisation du store au montage de l'application
onMounted(async () => {
  const gameStore = useGameStore()
  await gameStore.init()
})
</script>
