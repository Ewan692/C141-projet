<template>
  <v-container>
    <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        class="mb-4"
        @click="$router.back()"
    >
      Retour
    </v-btn>

    <v-alert
        v-if="!game"
        type="error"
        variant="tonal"
    >
      Jeu non trouvé.
    </v-alert>

    <v-card
        v-else
        max-width="800"
        class="mx-auto"
    >
      <v-img
          :src="game.background_image"
          height="300"
          cover
      />

      <v-card-title class="text-h4">
        {{ game.name }}
      </v-card-title>

      <v-card-subtitle class="d-flex align-center justify-space-between">
        <span>
          Rating {{ game.rating }}
        </span>

        <v-btn
            :icon="gameStore.isFavorite(game) ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="gameStore.isFavorite(game) ? 'red' : ''"
            variant="text"
            @click.stop.prevent="toggleFavorite()"
        />
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
      </v-card-subtitle>

      <v-card-subtitle v-if="game.alternative_names">
        Alternative names {{ game.alternative_names }}
      </v-card-subtitle>

      <v-card-text>
        <p v-if="game.description_raw" class="text-body-1 mb-4">
          {{ game.description_raw }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute } from "vue-router";
import {computed, ref} from "vue";
import { useGameStore } from "@/stores/gameStore.js";

// Snackbar
const showSnackbar = ref(false)
const snackbarMessage = ref('')

// Récupérer l'ID depuis les paramètres de la route
const route = useRoute()
const gameStore = useGameStore()

// Utiliser le getter du store pour trouver le jeu computed se met à jour automatiquement si l'ID change
const game = computed(() => {
  return gameStore.getGameById(route.params.id)
})

/**
 * Ajouter ou retirer des favoris
 */
function toggleFavorite() {
  const wasFavorite = gameStore.isFavorite(game.value)
  gameStore.toggleFavorite(game.value)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
}
</script>
