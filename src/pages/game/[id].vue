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

      <v-card-subtitle>
        Rating {{ game.rating }}
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
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";

const route = useRoute()
const game = ref([])

try {
  onMounted(async () => {
    const response = await fetch(`https://api.rawg.io/api/games/${route.params.id}?key=65431f6a205b4ae0899f6dade712f408`)

    // Conversion de la réponse en JSON si elle ne l'est pas déjà
    game.value = await response.json()
    console.log(game.value)
  })
} catch (error) {
  console.error('Erreur lors de la récupération d\'un jeu:', error)
}
</script>
