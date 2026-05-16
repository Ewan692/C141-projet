<template>
  <v-container>
    <!-- Titre de la page -->
    <h1 class="text-h3 text-center my-6">Mes favoris ({{ gameStore.totalFavorites }})</h1>

    <!-- Message informatif si aucun jeu favori -->
    <v-alert v-if="gameStore.totalFavorites === 0" type="info" variant="tonal" class="mb-6">
      Vous n'avez pas encore de jeu favori.
    </v-alert>

    <!-- Grille de cartes Pokémon favoris -->
    <v-row v-else>
      <v-col
          v-for="game in gameStore.getFavorites"
          :key="game.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <game-card :game="game" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import GameCard from "@/components/GameCard.vue";
import {useGameStore} from "@/stores/gameStore.js";

const gameStore = useGameStore()
</script>
