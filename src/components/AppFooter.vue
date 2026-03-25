<template>
  <v-footer>
    <div class="px-4 text-center w-100">
      <!-- Slot par défaut si rien n'est affiché -->
      <slot>C141 - ESIG {{ new Date().getFullYear() }} | Games Catalog</slot>
    </div>
  </v-footer>
</template>

<script setup></script>
