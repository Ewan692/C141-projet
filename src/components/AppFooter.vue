<template>
  <v-footer class="border-t" color="#183b4f">
    <!-- Slot par défaut si rien n'est affiché -->
    <slot>
      <v-container>
        <div class="d-flex flex-column flex-md-row align-center justify-space-between py-4">
          <div class="text-body-1 mb-2 mb-md-0">
            🎮 Games Catalog
          </div>

          <div class="text-body-1 text-medium-emphasis">
            C141 - ESIG • {{ new Date().getFullYear() }}
          </div>

          <div class="text-body-1 mt-2 mt-md-0">
            © Ewan Pfister
          </div>

          <!-- Bouton retour en haut -->
          <v-btn class="mt-2"
              icon="mdi-arrow-up"
              variant="tonal"
              @click="scrollToTop"
          />
        </div>
      </v-container>
    </slot>
  </v-footer>
</template>

<script setup>
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>
