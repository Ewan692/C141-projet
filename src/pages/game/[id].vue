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
      <!-- py-6 est le padding vertical (avant et après) -->
      <v-card-title class="text-h4 text-center py-6">
        {{ game.name }}
      </v-card-title>

      <v-img
          :src="game.background_image"
          height="300"
          cover
      />

      <!-- mt-5 est une marge au-dessus du rating -->
      <v-card-subtitle class="d-flex align-center justify-space-between mt-5">
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

      <!--<v-card-text>
        <p v-if="game.platforms" class="text-body-1 mb-4">
          <v-card-subtitle class="text-h6">
            Description
          </v-card-subtitle>
          {{ game.platforms }}
        </p>
      </v-card-text>-->

      <!-- Vérifie que le jeu possède des plateformes -->
      <v-card-text v-if="game.platforms?.length">
        <div class="text-subtitle-1 mb-2">Plateformes :</div>

        <v-chip-group>
          <!-- Chaque "chip" est une sorte de badge avec le nom de la plateforme à l'affichage -->
          <v-chip
              v-for="p in game.platforms"
              :key="p.platform.id"
              size="small"
              class="ma-1"
              variant="outlined"
          >
            {{ p.platform.name }}
          </v-chip>
        </v-chip-group>
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
 * Ajouter ou retirer un favori
 */
function toggleFavorite() {
  const wasFavorite = gameStore.isFavorite(game.value)
  gameStore.toggleFavorite(game.value)
  snackbarMessage.value = wasFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
  showSnackbar.value = true
}
</script>
