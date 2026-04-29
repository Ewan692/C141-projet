import { defineStore } from 'pinia'
import api from "@/plugins/axios.js";

/**
 * Store Pinia pour gérer les données des jeux.
 * Centralise les appels API et partage les données entre les pages.
 */
export const useGameStore = defineStore('game', {
    /**
     * State — les données brutes du store.
     * Retourne une fonction qui retourne un objet (comme data() dans Options API).
     */
    state: () => ({
        // Liste de tous les jeux chargés depuis l'API
        games: [],
        // Jeu sélectionné (détail)
        selectedGame: null,
        // Indicateur de chargement — true pendant les appels API
        isLoading: false,
        // Message d'erreur en cas de problème
        error: null,
    }),

    /**
     * Getters — propriétés calculées basées sur le state.
     * Équivalent de computed() dans un composant.
     */
    getters: {
        /**
         * Nombre total de jeux dans le store.
         * @param {Object} state - Le state du store
         * @returns {number}
         */
        totalGames: (state) => {
            return state.games.length
        },

        /**
         * Trouve un jeu par son identifiant.
         * Retourne une fonction (getter avec paramètre).
         * @param {Object} state - Le state du store
         * @returns {function(string): Object|undefined}
         */
        getGameById: (state) => {
            return (gameId) => {
                return state.games.find(game => game.id == gameId)
                // ATTENTION => On compare tring avec number donc seulement == (sinon ça marche pas)
            }
        },
    },

    /**
     * Actions — méthodes qui modifient le state.
     * Peuvent être asynchrones (appels API).
     * On accède au state avec `this`.
     */
    actions: {
        /**
         * Charge tous les Pokémon depuis l'API.
         * Note : ne gère pas isLoading — c'est init() qui s'en charge.
         */
        async fetchGames ({ withLoader = true } = {}){
            if (withLoader) {
                this.isLoading = true
            }

            try {
                // Ancienne néthode manuelle avec un fetch
                //const response = await fetch('https://api.rawg.io/api/games?key=VITE_API_KEY') // ancienne méthode fetch
                const response = await api.get('/games')

                // On affecte response.data.results à this.games s’il existe ; sinon, on lui donne un tableau vide
                if (response.data.results) {
                    this.games = response.data.results;
                } else {
                    this.games = [];
                }
            } catch (error) {
                console.error('Erreur API:', error.message)
            } finally {
                if (withLoader) this.isLoading = false
            }
        },

        /**
         * Initialise le store.
         * À appeler une seule fois au démarrage de l'application (dans App.vue).
         */
        async init() {
            console.log('Initialisation du store Games...')

            this.isLoading = true
            this.error = null

            try {
                // Promise.all exécute les deux requêtes en parallèle qui est plus rapide que de les faire l'une après l'autre
                await Promise.all([
                    this.fetchGames(),
                ])

                console.log('Store Games initialisé !')
                console.log(this.games)
                console.log('Jeux chargés :', this.games.length)
            } catch (error) {
                this.error = 'Erreur lors du chargement des données'
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },
    },
})
