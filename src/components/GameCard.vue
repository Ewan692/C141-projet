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

    <!-- Utilisation du flex pour mettre le rating au même niveau que le coeur -->
    <v-card-subtitle class="d-flex align-center justify-space-between">
      <span>
        Rating {{ game.rating }}
      </span>

      <v-card-actions>
        <v-spacer />
        <v-btn
            :icon="gameStore.isFavorite(game) ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="gameStore.isFavorite(game) ? 'red' : ''"
            variant="text"
            @click.stop.prevent="toggleFavorite()"
        />
      </v-card-actions>
    </v-card-subtitle>
    <!-- Snackbar de confirmation
      => timeout="2000" masque automatiquement après 4 secondes
      => Le message change selon l'action (ajout ou retrait)
    -->
    <v-snackbar
        v-model="showSnackbar"
        :timeout="4000"
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

/**
 * Ajouter ou retirer un favori
 */
function toggleFavorite() {
  const wasFavorite = gameStore.isFavorite(game)
  gameStore.toggleFavorite(game)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
}
</script>
