<template>
  <v-container>
    <h1 class="text-h4 my-4">GAMES</h1>

    <!-- Recherche + filtre + tri -->
    <v-row class="mb-4">
      <!-- Recherche -->
      <v-col cols="12" sm="6" md="4">
        <v-text-field
            v-model="searchQuery"
            label="Rechercher un jeu"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
        />
      </v-col>

      <!-- Filtre par rating minimum -->
      <v-col cols="12" sm="6" md="4">
        <v-select
            v-model="minRating"
            :items="[1, 2, 3, 4, 5]"
            item-title="name"
            item-value="id"
            label="Filtrer par note"
            prepend-inner-icon="mdi-filter"
            clearable
            density="compact"
        />
      </v-col>

      <!-- Tri alphabétique -->
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn
            variant="outlined"
            :prepend-icon="sortOrder === 'asc'
            ? 'mdi-sort-numeric-ascending'
            : 'mdi-sort-numeric-descending'"
            @click="toggleSort"
        >
          Tri alphabétique {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- LOADING -->
    <v-row v-if="gameStore.isLoading">
      <v-col
          v-for="n in 8"
          :key="n"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <!-- Squelette -->
        <v-skeleton-loader
            type="image, article"
            height="350"
        />
      </v-col>
    </v-row>

    <!-- ERROR -->
    <v-alert
        v-else-if="gameStore.games.length === 0"
        type="error"
        variant="tonal"
        class="mb-6"
    >
      Impossible de charger les jeux. Vérifiez l'API !
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="game in sortedGames"
          :key="game.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      > <!--  Î pour le responsive -->

        <!-- Composant de carte pour chaque jeu -->
        <game-card :game="game" />

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import GameCard from "@/components/GameCard.vue";
import {useGameStore} from "@/stores/gameStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";

// Destructurer le state en gardant la réactivité
// storeToRefs convertit chaque propriété du state en ref
const gameStore = useGameStore()
const { games } = storeToRefs(gameStore);

const searchQuery = ref('')
const sortOrder = ref('asc')
const minRating = ref(null)

/*        OLD
// Filtrer par recherche de nom
const filteredGames = computed(() => {
  if (!searchQuery.value) {
    return gameStore.games
  }
  const query = searchQuery.value

  return gameStore.games.filter(function (game) {
    return game.name.toLowerCase().includes(query.toLowerCase()); // affiche un avertissement mais ça marche quand même
  });
})

// Filtrer par rating minimum
const filteredByRating = computed(() => {
  if (minRating.value === null) return gameStore.games

  return gameStore.games.filter(game =>
      game.rating >= minRating.value
  )
})*/

// Trier par ordre alphabétique
// On clone le tableau pour éviter de modifier le state Pinia
const sortedGames = computed(() => {
  // Filtrer par recherche de nom
  const filteredBySearch = searchQuery.value
      ? games.value.filter(game => game.name.toLowerCase().includes(searchQuery.value.toLowerCase())) // affiche un avertissement mais ça marche quand même
      : games.value;

  // Filtrer par rating
  const filteredByRating = minRating.value !== null
      ? filteredBySearch.filter(game => game.rating >= minRating.value && game.rating <= minRating.value+1)
      : filteredBySearch;

  // Tri par nom de A-Z et si égalité, par rating du plus élevé au plus bas
  return [...filteredByRating].sort((a, b) => {
    // Trier par ordre alphabétique
    const nameComparison = a.name.localeCompare(b.name, 'fr');
    if (nameComparison !== 0) {
      return sortOrder.value === 'asc' ? nameComparison : -nameComparison;
    }
    // Si les noms sont égaux, tri par rating
    return sortOrder.value === 'asc' ? b.rating - a.rating : a.rating - b.rating;
  });
});

// Inverser l'ordre du tri
function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
}
</script>
