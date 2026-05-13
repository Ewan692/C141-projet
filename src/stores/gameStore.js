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
        // Jeux favoris de l'utilisateur
        favorites: [],
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
                // ATTENTION => On compare string avec number donc seulement == (sinon ça marche pas)
            }
        },

        /**
         * Nombre total de favoris
         */
        totalFavorites: (state) => {
            return state.favorites.length
        },

        /**
         * Vérifie si un jeu est en favori
         */
        isFavorite: (state) => {
            return (game) => {
                return state.favorites.includes(game.id)
            }
        },

        /**
         * Retourne les jeux favoris
         */
        getFavorites: (state) => {
            return state.favorites
                .map(id => state.games.find(game => game.id === id))
                .filter(game => game !== undefined)
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
                this.cleanupFavorites()

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
         * Charger les favoris depuis le localStorage
         */
        loadFavorites() {
            try {
                const saved = localStorage.getItem('game_favorites')

                if (saved) {
                    // Transformer le string du localStorage en tableau
                    this.favorites = JSON.parse(saved)
                    console.log('Favoris chargés :', this.favorites.length, 'éléments')
                } else {
                    this.favorites = []
                }

            } catch (error) {
                console.error('Erreur lors du chargement des favoris:', error)
                this.favorites = []
            }
        },

        /**
         * Sauvegarde les favoris dans le localStorage
         */
        saveFavorites () {
            try {
                // Transformer le tableau en string pour le localStorage
                localStorage.setItem('game_favorites', JSON.stringify(this.favorites))
            } catch (error) {
                console.error('Erreur lors de la sauvegarde des favoris :', error)
            }
        },

        /**
         * Ajouter ou retirer un favori
         */
        toggleFavorite: function (game) {
            const favoriteIndex = this.favorites.findIndex(
                favoriteId => favoriteId === game.id
            )

            if (favoriteIndex === -1) {
                this.favorites.push(game.id) // ajouter
            } else {
                this.favorites.splice(favoriteIndex, 1) // supprimer
            }
            this.saveFavorites()
        },

        /**
         * Supprime les favoris dont le jeu n'existe plus
         */
        cleanupFavorites () {
            const initialCount = this.favorites.length
            this.favorites = this.favorites.filter(favoriteId => {
                return this.games.some(game => game.id === favoriteId)
            })
            const removedCount = initialCount - this.favorites.length
            if (removedCount > 0) {
                console.log('Nettoyage :', removedCount, 'favoris obsolètes supprimés')
                this.saveFavorites()
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
                // Promise.all exécute toutes les requêtes en parallèle.
                // Ce qui est évidemment plus rapide que de les faire l'une après l'autre.
                await Promise.all([
                    this.fetchGames(),
                ])

                this.loadFavorites()

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
