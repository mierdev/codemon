// importing with ES6 syntax
import mongoose from "mongoose";

// setup schema
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
		required: true
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

// export
export default mongoose.model("Ability", abilitiesSchema);