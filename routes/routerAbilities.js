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
		statusEffectSpeed: req.body.statusEffectSpeed,
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

// READ one
router.get("/:id", getAbility, (_, res) => {
	res.json(res.ability);
});

// UPDATE one
router.patch("/:id", getAbility, (req, res) => {
	res.send("UPDATE ONE");
});


//TODO: ik ben bij 25:50 in de video


// DELETE one
router.delete("/:id", getAbility, async (_, res) => {
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