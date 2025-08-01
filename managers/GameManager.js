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
	 * Initializes the default language data with their stats and abilities.
	 * Sets up programming languages as Pokemon with their respective abilities, powers, and accuracies.
	 * Each language has 3 abilities with varying power levels and accuracy percentages.
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
					description:
						"Deals initial damage + 25 delayed damage. 25% chance of Callback Hell.",
					cooldown: 2,
				},
				{
					name: "Framework Flux",
					type: "Passive",
					power: 38,
					accuracy: 100,
					description:
						"40% chance each turn to gain +1 random stat. 10% chance to lose -1.",
					cooldown: 0,
				},
			],
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

		const effectiveStat = Math.floor(baseStat * multiplier);

		// console.log(
		// 	`${
		// 		pokemon.name
		// 	} ${stat}: Base=${baseStat}, Buffs=+${buffStages}, Debuffs=-${debuffStages}, Net=${netStages}, Multiplier=${multiplier.toFixed(
		// 		2
		// 	)}, Effective=${effectiveStat}`
		// );

		return effectiveStat;
	}

	/**
	 * Applies a buff to a Pokemon's stat.
	 * @param {Object} pokemon - The Pokemon to buff
	 * @param {string} stat - The stat to buff
	 * @param {number} stages - Number of stages to increase (default 1)
	 * @returns {string} Description of the buff applied
	 */
	applyBuff(pokemon, stat, stages = 1) {
		const oldBuffs = pokemon.buffs[stat] || 0;
		const oldValue = this.getEffectiveStat(pokemon, stat);

		pokemon.buffs[stat] = Math.min(4, oldBuffs + stages);
		const newValue = this.getEffectiveStat(pokemon, stat);

		console.log(
			`BUFF APPLIED: ${pokemon.name} ${stat} +${stages} stages (${oldBuffs} → ${pokemon.buffs[stat]})`
		);
		console.log(`   ${pokemon.name} ${stat}: ${oldValue} → ${newValue}`);

		return `${pokemon.name}'s ${stat} rose! (${oldValue} → ${newValue})`;
	}

	/**
	 * Applies a debuff to a Pokemon's stat.
	 * @param {Object} pokemon - The Pokemon to debuff
	 * @param {string} stat - The stat to debuff
	 * @param {number} stages - Number of stages to decrease (default 1)
	 * @returns {string} Description of the debuff applied
	 */
	applyDebuff(pokemon, stat, stages = 1) {
		const oldDebuffs = pokemon.debuffs[stat] || 0;
		const oldValue = this.getEffectiveStat(pokemon, stat);

		pokemon.debuffs[stat] = Math.min(4, oldDebuffs + stages);
		const newValue = this.getEffectiveStat(pokemon, stat);

		console.log(
			`DEBUFF APPLIED: ${pokemon.name} ${stat} -${stages} stages (${oldDebuffs} → ${pokemon.debuffs[stat]})`
		);
		console.log(`   ${pokemon.name} ${stat}: ${oldValue} → ${newValue}`);

		return `${pokemon.name}'s ${stat} fell! (${oldValue} → ${newValue})`;
	}

	/**
	 * Calculates damage using the proper damage formula with effective stats.
	 * @param {Object} attacker - The attacking Pokemon
	 * @param {Object} defender - The defending Pokemon
	 * @param {Object} ability - The ability being used
	 * @returns {number} The calculated damage
	 */
	calculateDamage(attacker, defender, ability) {
		const basePower = ability.power;

		// console.log(
		// 	`DAMAGE CALCULATION: ${attacker.name} uses ${ability.name} (${ability.type}, ${basePower} BP) vs ${defender.name}`
		// );

		// Determine attack and defense stats based on ability type
		let attackStat, defenseStat;
		if (ability.type === "Physical") {
			attackStat = this.getEffectiveStat(attacker, "attack");
			defenseStat = this.getEffectiveStat(defender, "defense");
			console.log(
				`   Using Physical stats: Attack=${attackStat}, Defense=${defenseStat}`
			);
		} else {
			attackStat = this.getEffectiveStat(attacker, "specialAttack");
			defenseStat = this.getEffectiveStat(defender, "specialDefense");
			console.log(
				`   Using Special stats: SpAtk=${attackStat}, SpDef=${defenseStat}`
			);
		}

		// Damage formula: (Base Power * Attack / Defense) * Random Factor
		const randomFactor = Math.random() * 0.3 + 0.85;
		const damage = Math.floor(
			((basePower * attackStat) / defenseStat) * randomFactor
		);
		const finalDamage = Math.max(1, damage); // Minimum 1 damage

		// console.log(
		// 	`   Formula: (${basePower} × ${attackStat} ÷ ${defenseStat}) × ${randomFactor.toFixed(
		// 		2
		// 	)} = ${finalDamage} damage`
		// );
		// console.log(
		// 	`   ${defender.name} HP: ${defender.hp} → ${defender.hp - finalDamage}`
		// );

		return finalDamage;
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
	/**
	 * Simple tournament management tracking wins and generating opponents
	 */
	startTournament(matchCount, playerLanguage) {
		const winsNeeded = Math.ceil(matchCount / 2);

		this.tournament = {
			type: matchCount, // 3, 5, 7 total matches
			winsNeeded: winsNeeded, // 2, 3, 4 to get shiny
			matchesPlayed: 0,
			wins: 0,
			losses: 0,
			playerLanguage: playerLanguage,
			isActive: true,
		};

		console.log(
			`Tournament started: Best of ${matchCount} (need ${winsNeeded} for shiny)`
		);

		this.trainers = [
			{ name: "Nallo", language: "rust" },
			{ name: "Dan", language: "javascript" },
			{ name: "Miranda", language: "python" },
			{ name: "Nuc", language: "ocaml" },
			{ name: "Lane", language: "go" },
			{ name: "Lyle", language: "csharp" },
		];
		return this.getNextOpponent();
	}

	getNextOpponent() {
		if (!this.tournament || !this.tournament.isActive) {
			console.log("No active tournament ");
			return null;
		}

		/// Filter out player's languages and get random opponent
		const availableTrainers = this.trainers.filter(
			(trainer) => trainer.language !== this.tournament.playerLanguage
		);
		const randomTrainer =
			availableTrainers[Math.floor(Math.random() * availableTrainers.length)];
		console.log(
			`getting next opponent and returning ${randomTrainer} match: ${this.tournament.matchesPlayed} total: ${this.tournament.type}`
		);
		return {
			trainer: randomTrainer,
			match: this.tournament.matchesPlayed + 1,
			total: this.tournament.type,
		};
	}

	recordWin() {
		if (!this.tournament) return null;
		this.tournament.wins++;
		this.tournament.matchesPlayed++;
		console.log(
			`In record win, with: ${this.tournament.wins} total: ${this.tournament.type}`
		);

		if (this.tournament.wins >= this.tournament.winsNeeded) {
			const result = {
				completed: true,
				won: true,
				wins: this.tournament.wins,
				losses: this.tournament.losses,
				total: this.tournament.type,
				winsNeeded: this.tournament.winsNeeded,
				trophy:
					this.tournament.type === 3
						? "Bronze"
						: this.tournament.type === 5
						? "Silver"
						: "Gold",
			};

			this.tournament = null;
			return result;
		}

		// Continue tournaments
		if (this.tournament.matchesPlayed <= this.tournament.type) {
			console.log("Continuing tournament not enough wins yet...");
			return {
				completed: false,
				nextOpponent: this.getNextOpponent(),
			};
		}

		// Reutrn next match hoping it doesn't get here...
		console.log(
			"Shouldn't have reached this point of Game Manager with recording wins..."
		);
		const result = {
			completed: true,
			won: false,
			wins: this.tournament.wins,
			losses: this.tournament.losses,
			total: this.tournament.type,
			winsNeeded: this.tournament.winsNeeded,
			trophy: "No shiny - didn't get enough wins",
		};
		this.tournament = null;
		return result;
	}

	recordLoss() {
		if (!this.tournament) return null;

		this.tournament.losses++;
		this.tournament.matchesPlayed++;

		console.log(
			`Player lost a match: ${this.tournament.wins}-${this.tournament.losses}`
		);

		const matchesLeft = this.tournament.type - this.tournament.matchesPlayed;
		const maxPossibleWins = this.tournament.wins + matchesLeft;

		console.log(
			`Matches left ${matchesLeft} vs possible wins: ${maxPossibleWins}`
		);

		if (maxPossibleWins < this.tournament.winsNeeded) {
			console.log("Max wins reached, no more wins possible");
			const result = {
				completed: true,
				won: false,
				wins: this.tournament.wins,
				losses: this.tournament.losses,
				total: this.tournament.type,
				winsNeeded: this.tournament.winsNeeded,
				trophy: "No shiny coin for you this time... keep trying, you got this!",
			};
			this.tournament = null;
			return result;
		}

		// Continue tournament if wins are still possible
		if (this.tournament.matchesPlayed < this.tournament.type) {
			return {
				completed: false,
				won: false,
				nextOpponent: this.getNextOpponent(),
			};
		}

		// Reached max without enough wins - Tournament over
		const result = {
			completed: true,
			won: false,
			wins: this.tournament.wins,
			losses: this.tournament.losses,
			total: this.tournament.type,
			winsNeeded: this.tournament.winsNeeded,
			trophy: "No trophy - didn't get enough wins",
		};
		this.tournament = null;
		return result;
	}
}
