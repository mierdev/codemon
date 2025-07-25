// const mongoose = require("mongoose");
/**
 * Importing with ES6 syntax
 */
import mongoose from "mongoose";

const abilitiesSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	power: {
		type: Number,
		required: true,
	},
	accuracy: {
		type: Number,
		required: true,
	},
	statusEffectAttack: {
		type: Number,
	},
	statusEffectSpecialAttack: {
		type: Number,
	},
	statusEffectDefense: {
		type: Number,
	},
	statusEffectSpecialDefense: {
		type: Number,
	},
	statusEffectSpeed: {
		type: Number,
	},
});

// module.exports = mongoose.model("Ability", abilitiesSchema);
export default mongoose.model("Ability", abilitiesSchema);
