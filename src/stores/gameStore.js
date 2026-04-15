import { defineStore } from 'pinia'

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
        async fetchGames() {
            const response = await fetch('https://api.rawg.io/api/games?key=65431f6a205b4ae0899f6dade712f408')

            // Vérifier que la réponse est OK (status 200-299)
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }


            // Conversion de la réponse en JSON si elle ne l'est pas déjà
            const data = await response.json()

            if (data.results) {
                this.games = data.results;
            } else {
                this.games = [];
            }
        },

        /**
         * Charge un seul jeu depuis l'API en ligne.
         */
        async fetchGameById(id) {
            const response = await fetch(`https://api.rawg.io/api/games/${id}?key=65431f6a205b4ae0899f6dade712f408`)

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`)
            }

            this.selectedGame = await response.json()
            console.log('Jeu chargé :', id)
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
                // Promise.all exécute les deux requêtes en parallèle
                // Plus rapide que de les faire l'une après l'autre
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
