<template>
  <v-card  :to="`/game/${game.id}`" hover>
    <v-img
        :src="game.background_image"
        height="200"
        cover
    />

    <v-card-title>
      {{ game.name }}
    </v-card-title>

    <v-card-subtitle>
      Rating {{ game.rating }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
// Définition des props reçus
defineProps({
  game: {
    type: Object,
    required: true, // Obligatoire pour afficher la carte correctement
  },
})
</script>
