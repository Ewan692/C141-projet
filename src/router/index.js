import { createWebHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  /**
   * Fonction de Vue Router appelée automatiquement à chaque changement de page
   * Permet de ramener l'utilisateur en haut lorsqu'il ouvre une nouvelle page
   */
  scrollBehavior(to, from, savedPosition) {
    // Ne pas revenir en haut lorsque le navigateur "revient en arrière"
    if (savedPosition) {
      return savedPosition
    }

    // Pour toutes les autres navigations, on remonte tout en haut
    return {
      top: 0,
    }
  }
})

export default router
