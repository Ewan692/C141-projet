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
          height="400"
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

      <!-- Petite ligne de séparation discrète -->
      <v-divider class="my-3"/>

      <!-- PLATEFOMRES -->
      <v-card-text v-if="game.platforms?.length">
        <!-- Vérifie que le jeu possède des plateformes -->
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

      <!-- GENRES -->
      <v-card-text v-if="game.genres?.length">
        <!-- Affiche uniquement si il y a au moins 1 genre -->
        <div class="text-subtitle-1 mb-2">Genres :</div>

        <v-chip-group>
          <v-chip
              v-for="genre in game.genres"
              :key="genre.id"
              size="small"
              class="ma-1"
              variant="outlined"
          >
            {{ genre.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>

      <!-- MAGASINS -->
      <v-card-text v-if="game.stores?.length">
        <div class="text-subtitle-1 mb-2">Stores :</div>

        <v-chip-group>
          <v-chip
              v-for="s in game.stores"
              :key="s.id"
              size="small"
              class="ma-1"
              variant="outlined"
          >
            {{ s.store.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>

      <!-- AUTRES IMAGES -->
      <v-card-text v-if="game.short_screenshots?.length">
        <div class="text-subtitle-1 mb-2">Aperçus :</div>
        <v-row>
          <!-- On ignore la première image car c'est la cover du jeu -->
          <v-col
              v-for="shot in game.short_screenshots.slice(1, 4)"
              :key="shot.id"
              cols="12"
              sm="4"
          >
            <v-img
                :src="shot.image"
                height="200"
                cover
                class="rounded"
            />
          </v-col>
        </v-row>
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
