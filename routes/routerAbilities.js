// importing libraries using the import syntax favoured by ES6
import express from "express";
import Ability from "../models/modelAbilities.js";
import { error } from "console";

const router = express.Router();

// CREATE one
router.post("/", async (req, res) => {
	const ability = new Ability({
		name: req.body.name,
		type: req.body.type,
		description: req.body.description,
		power: req.body.power,
		accuracy: req.body.accuracy,
		statusEffectAttack: req.body.statusEffectAttack,
		statusEffectSpecialAttack: req.body.statusEffectSpecialAttack,
		statusEffectDefense: req.body.statusEffectDefense,
		statusEffectSpecialDefense: req.body.statusEffectSpecialDefense,
		statusEffectSpeed: req.body.statusEffectSpeed
	});

	try {
		const newAbility = await ability.save();
		res.status(201).json(newAbility);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// READ all
router.get("/", async (_, res) => {
	try {
		const abilities = await Ability.find();
		res.json(abilities);
	} catch (err) {
		res.status(500).json({ message: error.message });
	}
});


// dynamic endpoints (READ/UPDATE/DELETE one)
router
.route("/:id")
.get(getAbility, (_, res) => {
	res.json(res.ability);
})
.patch(getAbility, async (req, res) => {
	if (req.body.name !== undefined) {
		res.ability.name = req.body.name;
	};
	if (req.body.type !== undefined) {
		res.ability.type = req.body.type;
	};
	if (req.body.description !== undefined) {
		res.ability.description = req.body.description;
	};
	if (req.body.power !== undefined) {
		res.ability.power = req.body.power;
	};
	if (req.body.accuracy !== undefined) {
		res.ability.accuracy = req.body.accuracy;
	};
	if (req.body.statusEffectAttack !== undefined) {
		res.ability.statusEffectAttack = req.body.statusEffectAttack;
	};
	if (req.body.statusEffectSpecialAttack !== undefined) {
		res.ability.statusEffectSpecialAttack = req.body.statusEffectSpecialAttack;
	};
	if (req.body.statusEffectDefense !== undefined) {
		res.ability.statusEffectDefense = req.body.statusEffectDefense;
	};
	if (req.body.statusEffectSpecialDefense !== undefined) {
		res.ability.statusEffectSpecialDefense = req.body.statusEffectSpecialDefense;
	};
	if (req.body.statusEffectSpeed !== undefined) {
		res.ability.statusEffectSpeed = req.body.statusEffectSpeed;
	};

	try {
		const updatedAbility = await res.ability.save();
		res.json(updatedAbility);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
})
.delete(getAbility, async (_, res) => {
	try {
		await Ability.deleteOne({ _id: res.ability._id });
		res.json({ message: "Deleted ability" })
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
});

// middleware to get id
async function getAbility(req, res, next) {
	let ability;
	try {
		ability = await Ability.findById(req.params.id);
		if (ability === null) {
			return res.status(404).json({ message: "Can't find ability" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.ability = ability;
	next();
};

// export
export default router;