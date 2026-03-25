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

const currentYear = new Date().getFullYear()
</script>
