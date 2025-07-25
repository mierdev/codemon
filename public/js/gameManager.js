/**
 * Manages Pokemon data and battle initialization for the Pokemon battle game.
 * Handles Pokemon data storage, retrieval, and battle setup with fresh copies.
 */
class GameManager {
    /**
     * Initializes a new GameManager instance.
     * Creates a Map to store Pokemon data and initializes the default Pokemon.
     */
    constructor() {
        this.pokemonData = new Map();
        this.initializePokemonData();
    }

    /**
     * Initializes the default Pokemon data with their stats and abilities.
     * Sets up Charizard and Blastoise with their respective abilities, powers, and accuracies.
     * Each Pokemon has 5 abilities with varying power levels and accuracy percentages.
     */
    initializePokemonData() {
        this.pokemonData.set('charizard', {
            name: 'Charizard',
            type: 'Fire/Flying',
            hp: 100,
            maxHp: 100,
            abilities: [
                {
                    name: 'Flamethrower',
                    type: 'Fire',
                    power: 27,
                    accuracy: 75,
                    description: 'A powerful fire attack'
                },
                {
                    name: 'Air Slash',
                    type: 'Flying',
                    power: 23,
                    accuracy: 65,
                    description: 'A sharp wind attack'
                },
                {
                    name: 'Dragon Claw',
                    type: 'Dragon',
                    power: 24,
                    accuracy: 80,
                    description: 'A fierce dragon attack'
                },
                {
                    name: 'Earthquake',
                    type: 'Ground',
                    power: 30,
                    accuracy: 70,
                    description: 'A powerful ground attack'
                },
                {
                    name: 'Solar Beam',
                    type: 'Grass',
                    power: 36,
                    accuracy: 60,
                    description: 'A powerful beam of light'
                }
            ]
        });

        this.pokemonData.set('blastoise', {
            name: 'Blastoise',
            type: 'Water',
            hp: 100,
            maxHp: 100,
            abilities: [
                {
                    name: 'Hydro Pump',
                    type: 'Water',
                    power: 33,
                    accuracy: 55,
                    description: 'A powerful water attack'
                },
                {
                    name: 'Ice Beam',
                    type: 'Ice',
                    power: 27,
                    accuracy: 75,
                    description: 'A freezing beam attack'
                },
                {
                    name: 'Flash Cannon',
                    type: 'Steel',
                    power: 24,
                    accuracy: 70,
                    description: 'A metallic beam attack'
                },
                {
                    name: 'Dark Pulse',
                    type: 'Dark',
                    power: 24,
                    accuracy: 65,
                    description: 'A dark energy attack'
                },
                {
                    name: 'Aura Sphere',
                    type: 'Fighting',
                    power: 24,
                    accuracy: 80,
                    description: 'A concentrated energy attack'
                }
            ]
        });
    }

    /**
     * Retrieves Pokemon data by ID.
     * @param {string} pokemonId - The unique identifier for the Pokemon (e.g., 'charizard', 'blastoise')
     * @returns {Object|null} The Pokemon data object containing name, type, HP, and abilities, or null if not found
     */
    getPokemonData(pokemonId) {
        return this.pokemonData.get(pokemonId);
    }

    /**
     * Retrieves all Pokemon data as an array.
     * @returns {Array} Array of all Pokemon data objects
     */
    getAllPokemonData() {
        return Array.from(this.pokemonData.values());
    }

    /**
     * Starts a new battle between two Pokemon with fresh copies of their data.
     * Creates deep copies of Pokemon data to prevent HP persistence between battles.
     * @param {string} pokemon1Id - The ID of the first Pokemon (player's Pokemon)
     * @param {string} pokemon2Id - The ID of the second Pokemon (AI's Pokemon)
     * @returns {Object|null} Battle data object containing fresh copies of both Pokemon, or null if invalid IDs
     */
    startBattle(pokemon1Id, pokemon2Id) {
        const pokemon1Original = this.getPokemonData(pokemon1Id);
        const pokemon2Original = this.getPokemonData(pokemon2Id);
        
        if (!pokemon1Original || !pokemon2Original) {
            console.error('Invalid Pokemon IDs provided');
            return;
        }

        const pokemon1 = JSON.parse(JSON.stringify(pokemon1Original));
        const pokemon2 = JSON.parse(JSON.stringify(pokemon2Original));

        return {
            pokemon1: pokemon1,
            pokemon2: pokemon2
        };
    }

    /**
     * Updates Pokemon data from external API sources.
     * Allows dynamic updates to Pokemon data without restarting the game.
     * @param {string} pokemonId - The ID of the Pokemon to update
     * @param {Object} apiData - The new Pokemon data from the API
     */
    updatePokemonFromAPI(pokemonId, apiData) {
        this.pokemonData.set(pokemonId, apiData);
    }
} 