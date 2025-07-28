/**
 * Manages Pokemon data and battle initialization for the Pokemon battle game.
 * Handles Pokemon data storage, retrieval, and battle setup with fresh copies.
 */
class GameManager {
	constructor() {
		this.pokemonData = new Map();
		this.isDataLoaded = false;
	}

	/**
	 * Fetches language and ability data from the database API
	 * Loads all codemon data with their abilities and stats
	 * @returns {Promise<void>} Resolves when data is loaded
	 */
	async loadGameData() {
		try {
			const response = await fetch('/api/language-abilities/game-data');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const gameData = await response.json();
			
			this.pokemonData.clear();
			gameData.forEach(language => {
				this.pokemonData.set(language.id, language);
			});
			
			this.isDataLoaded = true;
		} catch (error) {
			console.error('Failed to load game data from database, using fallback data:', error);
			this.initializePokemonData();
		}
	}

	/**
	 * Initializes the default language data with their stats and abilities.
	 * Sets up programming languages as Pokemon with their respective abilities, powers, and accuracies.
	 * Each language has 3 abilities with varying power levels and accuracy percentages.
	 * This is used as a fallback when database loading fails.
	 */
	initializePokemonData() {
		this.pokemonData.set("python", {
			name: "Python",
			type: "Script",
			hp: 100,
			maxHp: 100,
			attack: 75,
			specialAttack: 85,
			defense: 75,
			specialDefense: 75,
			speed: 80,
			abilities: [
				{
					name: "Rapid Prototype",
					type: "Passive",
					power: 28,
					accuracy: 100,
					description:
						"Starts battle with +10 Speed bonus. Status effects last 1 less turn.",
					cooldown: 0,
				},
				{
					name: "Ecosystem Call",
					type: "Utility",
					power: 28,
					accuracy: 100,
					description: "Temporarily gains a secondary type for 3 turns.",
					cooldown: 5,
				},
			],
		});

		this.pokemonData.set("go", {
			name: "Go",
			type: "Concurrent/System",
			hp: 100,
			maxHp: 100,
			attack: 80,
			specialAttack: 75,
			defense: 85,
			specialDefense: 80,
			speed: 70,
			abilities: [
				{
					name: "Fast Compilation",
					type: "Passive",
					power: 25,
					accuracy: 100,
					description:
						"Takes turn first vs Script/Managed types. +5 Defense/SpDefense.",
					cooldown: 0,
				},
				{
					name: "Goroutine Swarm",
					type: "Special",
					power: 35,
					accuracy: 75,
					description:
						"Deals special damage. 25% chance to inflict Concurrency Bottleneck.",
					cooldown: 2,
				},
			],
		});

		this.pokemonData.set("rust", {
			name: "Rust",
			type: "System/Concurrent",
			hp: 100,
			maxHp: 100,
			attack: 85,
			specialAttack: 75,
			defense: 90,
			specialDefense: 85,
			speed: 65,
			abilities: [
				{
					name: "Borrow Checker",
					type: "Passive",
					power: 25,
					accuracy: 100,
					description: "Takes 50% less damage from memory corruption attacks.",
					cooldown: 0,
				},
				{
					name: "Zero-Cost Abstraction",
					type: "Buff",
					power: 25,
					accuracy: 100,
					description:
						"Increases Attack and Special Attack by 1 stage for 3 turns.",
					cooldown: 3,
				},
			],
		});

		this.pokemonData.set("ocaml", {
			name: "OCaml",
			type: "Functional",
			hp: 100,
			maxHp: 100,
			attack: 65,
			specialAttack: 95,
			defense: 70,
			specialDefense: 90,
			speed: 75,
			abilities: [
				{
					name: "Type Inference",
					type: "Passive",
					power: 24,
					accuracy: 100,
					description:
						"All abilities gain +10% accuracy. +15% crit vs multi-type targets.",
					cooldown: 0,
				},
				{
					name: "Pattern Matching",
					type: "Special",
					power: 44,
					accuracy: 85,
					description: "Deals special damage. +25 bonus vs C++ and JS/TS.",
					cooldown: 3,
				},
			],
		});

		this.pokemonData.set("csharp", {
			name: "C#",
			type: "Managed/Enterprise",
			hp: 100,
			maxHp: 100,
			attack: 85,
			specialAttack: 90,
			defense: 80,
			specialDefense: 85,
			speed: 75,
			abilities: [
				{
					name: "Garbage Collection",
					type: "Recovery",
					power: 25,
					accuracy: 100,
					description:
						"Heals 30% max HP and removes one debuff. 25% chance to gain +1 Defense.",
					cooldown: 4,
				},
				{
					name: "LINQ Query",
					type: "Special",
					power: 45,
					accuracy: 85,
					description: "Deals special damage. 30% chance to inflict 'Data Binding Error'.",
					cooldown: 3,
				},
			],
		});

		this.pokemonData.set("javascript", {
			name: "JavaScript & TypeScript",
			type: "Web/Script",
			hp: 100,
			maxHp: 100,
			attack: 70,
			specialAttack: 85,
			defense: 70,
			specialDefense: 70,
			speed: 90,
			abilities: [
				{
					name: "Asynchronous Promise",
					type: "Special",
					power: 48,
					accuracy: 75,
					description: "Deals initial damage + 25 delayed damage. 25% chance of Callback Hell.",
					cooldown: 2,
				},
				{
					name: "Framework Flux",
					type: "Passive",
					power: 38,
					accuracy: 100,
					description: "40% chance each turn to gain +1 random stat. 10% chance to lose -1.",
					cooldown: 0,
				},
			],
		});
	}

	/**
	 * Gets a language's data by its ID
	 * @param {string} languageId - The ID of the language to retrieve
	 * @returns {Object|null} The language data or null if not found
	 */
	getLanguageData(languageId) {
		return this.pokemonData.get(languageId) || null;
	}

	/**
	 * Gets all available language IDs
	 * @returns {Array<string>} Array of language IDs
	 */
	getAllLanguageIds() {
		return Array.from(this.pokemonData.keys());
	}

	/**
	 * Gets all language data
	 * @returns {Map} Map of all language data
	 */
	getAllLanguageData() {
		return this.pokemonData;
	}

	/**
	 * Checks if game data has been loaded
	 * @returns {boolean} True if data is loaded
	 */
	isGameDataLoaded() {
		return this.isDataLoaded;
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
			console.error("Invalid Pokemon IDs provided");
			return;
		}

		const pokemon1 = JSON.parse(JSON.stringify(pokemon1Original));
		const pokemon2 = JSON.parse(JSON.stringify(pokemon2Original));

		// Initialize buff/debuff systems
		this.initializeBuffsAndDebuffs(pokemon1);
		this.initializeBuffsAndDebuffs(pokemon2);

		// Add placeholder buffs/debuffs for testing
		this.applyBuff(pokemon1, "attack", 2);
		this.applyBuff(pokemon1, "speed", 1);
		this.applyDebuff(pokemon1, "defense", 1);

		this.applyBuff(pokemon2, "specialAttack", 1);
		this.applyDebuff(pokemon2, "speed", 2);

		return {
			pokemon1: pokemon1,
			pokemon2: pokemon2,
		};
	}

	/**
	 * Initializes buff and debuff tracking for a Pokemon.
	 * @param {Object} pokemon - The Pokemon to initialize buffs/debuffs for
	 */
	initializeBuffsAndDebuffs(pokemon) {
		pokemon.buffs = {
			attack: 0,
			specialAttack: 0,
			defense: 0,
			specialDefense: 0,
			speed: 0,
		};
		pokemon.debuffs = {
			attack: 0,
			specialAttack: 0,
			defense: 0,
			specialDefense: 0,
			speed: 0,
		};
		pokemon.statusEffects = [];
		pokemon.tempBuffs = [];
	}

	/**
	 * Calculates the effective stat value considering buffs and debuffs.
	 * @param {Object} pokemon - The Pokemon
	 * @param {string} stat - The stat to calculate (attack, specialAttack, defense, specialDefense, speed)
	 * @returns {number} The effective stat value
	 */
	getEffectiveStat(pokemon, stat) {
		const baseStat = pokemon[stat] || 0;
		const buffStages = pokemon.buffs[stat] || 0;
		const debuffStages = pokemon.debuffs[stat] || 0;
		const netStages = buffStages - debuffStages;

		// Apply stat stage multipliers
		let multiplier = 1.0;
		if (netStages > 0) {
			multiplier = 1 + netStages * 0.5; // +50% per stage
		} else if (netStages < 0) {
			multiplier = 1 / (1 + Math.abs(netStages) * 0.5); // -33% per stage
		}

		return Math.floor(baseStat * multiplier);
	}

	/**
	 * Applies a buff to a Pokemon's stat.
	 * @param {Object} pokemon - The Pokemon to buff
	 * @param {string} stat - The stat to buff (attack, specialAttack, defense, specialDefense, speed)
	 * @param {number} stages - Number of buff stages to apply (default: 1)
	 */
	applyBuff(pokemon, stat, stages = 1) {
		if (!pokemon.buffs) {
			pokemon.buffs = {};
		}
		const currentBuffs = pokemon.buffs[stat] || 0;
		const newBuffs = Math.min(currentBuffs + stages, 6);
		pokemon.buffs[stat] = newBuffs;
	}

	/**
	 * Applies a debuff to a Pokemon's stat.
	 * @param {Object} pokemon - The Pokemon to debuff
	 * @param {string} stat - The stat to debuff (attack, specialAttack, defense, specialDefense, speed)
	 * @param {number} stages - Number of debuff stages to apply (default: 1)
	 */
	applyDebuff(pokemon, stat, stages = 1) {
		if (!pokemon.debuffs) {
			pokemon.debuffs = {};
		}
		const currentDebuffs = pokemon.debuffs[stat] || 0;
		const newDebuffs = Math.min(currentDebuffs + stages, 6);
		pokemon.debuffs[stat] = newDebuffs;
	}

	/**
	 * Calculates damage for an ability based on attacker and defender stats.
	 * @param {Object} attacker - The attacking Pokemon
	 * @param {Object} defender - The defending Pokemon
	 * @param {Object} ability - The ability being used
	 * @returns {number} The calculated damage
	 */
	calculateDamage(attacker, defender, ability) {
		let attackStat, defenseStat;

		if (ability.type === "Physical") {
			attackStat = this.getEffectiveStat(attacker, "attack");
			defenseStat = this.getEffectiveStat(defender, "defense");
		} else if (ability.type === "Special") {
			attackStat = this.getEffectiveStat(attacker, "specialAttack");
			defenseStat = this.getEffectiveStat(defender, "specialDefense");
		} else {
			attackStat = this.getEffectiveStat(attacker, "attack");
			defenseStat = this.getEffectiveStat(defender, "defense");
		}

		let damage = Math.floor((attackStat * ability.power) / (defenseStat * 2) + 10);

		const typeEffectiveness = this.getTypeEffectiveness(attacker.type, defender.type);
		damage = Math.floor(damage * typeEffectiveness);

		return Math.max(1, damage);
	}

	/**
	 * Gets type effectiveness between two types.
	 * @param {string} attackerType - The attacking Pokemon's type
	 * @param {string} defenderType - The defending Pokemon's type
	 * @returns {number} The type effectiveness multiplier
	 */
	getTypeEffectiveness(attackerType, defenderType) {
		// Simplified type effectiveness chart
		const effectiveness = {
			"Script": { "Managed": 2.0, "Web": 2.0, "System": 0.5, "Concurrent": 0.5 },
			"System": { "Script": 2.0, "Managed": 2.0, "Concurrent": 0.5, "Functional": 0.5 },
			"Concurrent": { "System": 2.0, "Web": 2.0, "Functional": 0.5 },
			"Functional": { "System": 2.0, "Concurrent": 2.0, "Managed": 0.5, "Web": 0.5 },
			"Managed": { "Functional": 2.0, "Script": 0.5, "System": 0.5 },
			"Web": { "Script": 0.5, "Concurrent": 0.5 }
		};

		const attackerEffectiveness = effectiveness[attackerType];
		if (attackerEffectiveness && attackerEffectiveness[defenderType]) {
			return attackerEffectiveness[defenderType];
		}

		return 1.0; // Normal effectiveness
	}

	/**
	 * Updates Pokemon data from external API sources.
	 * @param {string} pokemonId - The ID of the Pokemon to update
	 * @param {Object} apiData - The new Pokemon data from the API
	 */
	updatePokemonFromAPI(pokemonId, apiData) {
		this.pokemonData.set(pokemonId, apiData);
	}

	/**
	 * Starts a tournament with the specified number of matches.
	 * @param {number} matchCount - Number of matches in the tournament (3, 5, or 7)
	 * @param {string} playerLanguage - The player's selected language
	 * @returns {Object} Tournament setup data
	 */
	startTournament(matchCount, playerLanguage) {
		this.tournament = {
			type: matchCount,
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			playerLanguage: playerLanguage,
			isActive: true,
		};

		this.trainers = [];
		return this.getNextOpponent();
	}

	/**
	 * Fetches trainers from the database for a specific language
	 * @param {string} languageId - The language ID to fetch trainers for
	 * @returns {Promise<Array>} Array of trainers
	 */
	async fetchTrainersForLanguage(languageId) {
		try {
			const response = await fetch(`/api/language-abilities/trainers/${languageId}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const trainers = await response.json();
			return trainers;
		} catch (error) {
			console.error(`Error fetching trainers for ${languageId}:`, error);
			return [];
		}
	}

	/**
	 * Gets all available trainers from the database
	 * @returns {Promise<Array>} Array of all trainers
	 */
	async fetchAllTrainers() {
		const allTrainers = [];
		const languageIds = this.getAllLanguageIds();
		
		for (const languageId of languageIds) {
			const trainers = await this.fetchTrainersForLanguage(languageId);
			allTrainers.push(...trainers);
		}
		
		return allTrainers;
	}

	/**
	 * Gets the next opponent for the tournament.
	 * @returns {Promise<Object|null>} Next opponent data or null if tournament is complete
	 */
	async getNextOpponent() {
		if (!this.tournament || !this.tournament.isActive) {
			return null;
		}

		// Fetch all trainers from database if not already loaded
		if (this.trainers.length === 0) {
			this.trainers = await this.fetchAllTrainers();
		}

		/// Filter out player's languages and get random opponent
		const availableTrainers = this.trainers.filter(
			(trainer) => trainer.codemon !== this.tournament.playerLanguage
		);
		const randomTrainer =
			availableTrainers[Math.floor(Math.random() * availableTrainers.length)];
		return {
			trainer: randomTrainer,
			match: this.tournament.matchesPlayed + 1,
			total: this.tournament.type,
		};
	}

	/**
	 * Records a win in the current tournament.
	 * @returns {Promise<Object|null>} Tournament result or null if tournament continues
	 */
	async recordWin() {
		if (!this.tournament) return null;
		this.tournament.wins++;
		this.tournament.matchesPlayed++;

		// Only end tournament after all matches are played
		if (this.tournament.matchesPlayed >= this.tournament.type) {
			const won = this.tournament.wins > this.tournament.losses;
			const result = {
				completed: true,
				won: won,
				wins: this.tournament.wins,
				losses: this.tournament.losses,
				total: this.tournament.type,
				trophy: won ? 
					(this.tournament.type === 3 ? "Bronze" : this.tournament.type === 5 ? "Silver" : "Gold") :
					"No shiny - didn't win enough matches",
			};

			this.tournament.isActive = false;
			return result;
		}

		// Continue tournament until all matches are played
		const nextOpponent = await this.getNextOpponent();
		return {
			completed: false,
			nextOpponent: nextOpponent,
			wins: this.tournament.wins,
			losses: this.tournament.losses,
			total: this.tournament.type,
			won: false,
		};
	}

	/**
	 * Records a loss in the current tournament.
	 * @returns {Promise<Object|null>} Tournament result or null if tournament continues
	 */
	async recordLoss() {
		if (!this.tournament) return null;
		this.tournament.losses++;
		this.tournament.matchesPlayed++;

		// Only end tournament after all matches are played
		if (this.tournament.matchesPlayed >= this.tournament.type) {
			const won = this.tournament.wins > this.tournament.losses;
			const result = {
				completed: true,
				won: won,
				wins: this.tournament.wins,
				losses: this.tournament.losses,
				total: this.tournament.type,
				trophy: won ? 
					(this.tournament.type === 3 ? "Bronze" : this.tournament.type === 5 ? "Silver" : "Gold") :
					"No shiny - didn't win enough matches",
			};

			this.tournament.isActive = false;
			return result;
		}

		// Continue tournament until all matches are played
		const nextOpponent = await this.getNextOpponent();
		return {
			completed: false,
			nextOpponent: nextOpponent,
			wins: this.tournament.wins,
			losses: this.tournament.losses,
			total: this.tournament.type,
			won: false,
		};
	}

	/**
	 * Starts a tournament battle between two languages.
	 * @param {string} playerLanguageId - The player's language ID
	 * @param {string} opponentLanguageId - The opponent's language ID
	 * @returns {Object|null} Battle data or null if invalid
	 */
	startTournamentBattle(playerLanguageId, opponentLanguageId) {
		const playerLanguage = this.getLanguageData(playerLanguageId);
		const opponentLanguage = this.getLanguageData(opponentLanguageId);

		if (!playerLanguage || !opponentLanguage) {
			return null;
		}

		// Create Pokemon objects from language data
		const pokemon1 = {
			name: playerLanguage.name,
			type: playerLanguage.type,
			hp: 100,
			maxHp: 100,
			attack: 75,
			specialAttack: 75,
			defense: 75,
			specialDefense: 75,
			speed: 75,
			abilities: playerLanguage.abilities
		};

		const pokemon2 = {
			name: opponentLanguage.name,
			type: opponentLanguage.type,
			hp: 100,
			maxHp: 100,
			attack: 75,
			specialAttack: 75,
			defense: 75,
			specialDefense: 75,
			speed: 75,
			abilities: opponentLanguage.abilities
		};

		// Initialize buff/debuff systems
		this.initializeBuffsAndDebuffs(pokemon1);
		this.initializeBuffsAndDebuffs(pokemon2);

		// Add placeholder buffs/debuffs for testing
		this.applyBuff(pokemon1, "attack", 2);
		this.applyBuff(pokemon1, "speed", 1);
		this.applyDebuff(pokemon1, "defense", 1);

		this.applyBuff(pokemon2, "specialAttack", 1);
		this.applyDebuff(pokemon2, "speed", 2);

		return {
			pokemon1: pokemon1,
			pokemon2: pokemon2,
		};
	}
} 