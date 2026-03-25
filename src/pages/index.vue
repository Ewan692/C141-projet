<template>
  <v-container>
    <h1 class="text-h4 my-4">GAMES</h1>

    <v-row>
      <v-col
          v-for="game in games"
          :key="game.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card>

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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {onMounted, ref} from "vue";

const games = ref([])

try {
// onMounted s'exécute quand le composant est monté
onMounted(async () => {
  const res = await fetch(
      `https://api.rawg.io/api/games?key=65431f6a205b4ae0899f6dade712f408`
  )

  // Conversion de la réponse en JSON si elle ne l'est pas déjà
  const data = await res.json()

  // On stocke uniquement le tableau "results" contenu dans la réponse json
  // Si le tableau "results" ne contient rien, on met un tableau vide
  if (data.results) {
    games.value = data.results;
  } else {
    games.value = [];
  }
  console.log(games.value)
})
} catch (error) {
  console.error('Erreur lors de la récupération des jeux:', error)
}
</script>
