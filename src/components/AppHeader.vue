<template>
  <!-- En-tête du site -->
  <v-app-bar flat>
    <!-- Icônes -->
    <v-avatar
        class="mr-4 pa-0 cursor-pointer"
        image="@/images/nintendo-game-boy.svg" alt="Icône de GambBoy"
        size="64"
        @click="$router.push('/')"
    />

    <!-- Titre -->
    <v-toolbar-title>Games Catalog</v-toolbar-title>

    <!-- Menu de navigation -->
    <v-btn
        v-for="link in menuItems"
        :key="link.title"
        :icon="link.icon"
        :to="link.path"
    />
  </v-app-bar>
</template>

<script setup>
const menuItems = [
  { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
]
</script>
