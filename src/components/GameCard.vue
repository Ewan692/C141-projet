<template>
  <v-card :to="`/game/${game.id}`" hover>
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

    <v-card-actions>
      <v-spacer />
      <v-btn
          :icon="game.isFavorite(game) ? 'mdi-heart' : 'mdi-heart-outline'"
          :color="game.isFavorite(game) ? 'red' : ''"
          variant="text"
          @click.stop.prevent="toggleFavorite()"
      />
    </v-card-actions>
    <!--
    Snackbar de confirmation
      * v-model contrôle l'affichage
      * timeout="2000" masque automatiquement après 2 secondes
      * Le message change selon l'action (ajout ou retrait)
    -->
    <v-snackbar
        v-model="showSnackbar"
        :timeout="2000"
        color="primary"
    >
      {{ snackbarMessage }}
    </v-snackbar>

  </v-card>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/gameStore.js";
const gameStore = useGameStore()
import { ref } from "vue";

const showSnackbar = ref(false)
const snackbarMessage = ref('')

// Définition des props reçus
const { game } = defineProps({
  game: {
    type: Object,
    required: true, // obligatoire pour afficher la carte correctement
  },
})

function toggleFavorite() {
  const wasFavorite = gameStore.isFavorite(game)
  gameStore.toggleFavorite(game)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
}
</script>
