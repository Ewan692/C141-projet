<template>
  <v-container>
    <h1 class="text-h4 my-4">GAMES</h1>

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
          v-for="game in games"
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

// Destructurer le state en gardant la réactivité
// storeToRefs convertit chaque propriété du state en ref
const gameStore = useGameStore()
const { games } = storeToRefs(gameStore);
//const games = storeToRefs(gameStore).games;
</script>
