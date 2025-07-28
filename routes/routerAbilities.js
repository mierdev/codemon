import express from "express";
import Ability from "../models/modelAbilities.js";
import { error } from "console";

const router = express.Router();

/**
 * Creates a new ability in the database
 * @param {Object} req - Express request object containing ability data
 * @param {Object} res - Express response object
 */
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

/**
 * Retrieves all abilities from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", async (_, res) => {
	try {
		const abilities = await Ability.find();
		res.json(abilities);
	} catch (err) {
		res.status(500).json({ message: error.message });
	}
});

/**
 * GET: Retrieves a specific ability by ID
 * PATCH: Updates a specific ability by ID
 * DELETE: Removes a specific ability by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router
.route("/:id")
.get(getAbility, (_, res) => {
	res.json(res.ability);
})
.patch(getAbility, async (req, res) => {
	if (req.body.name !== null) {
		res.ability.name = req.body.name;
	};
	if (req.body.type !== null) {
		res.ability.type = req.body.type;
	};
	if (req.body.description !== null) {
		res.ability.description = req.body.description;
	};
	if (req.body.power !== null) {
		res.ability.power = req.body.power;
	};
	if (req.body.accuracy !== null) {
		res.ability.accuracy = req.body.accuracy;
	};
	if (req.body.statusEffectAttack !== null) {
		res.ability.statusEffectAttack = req.body.statusEffectAttack;
	};
	if (req.body.statusEffectSpecialAttack !== null) {
		res.ability.statusEffectSpecialAttack = req.body.statusEffectSpecialAttack;
	};
	if (req.body.statusEffectDefense !== null) {
		res.ability.statusEffectDefense = req.body.statusEffectDefense;
	};
	if (req.body.statusEffectSpecialDefense !== null) {
		res.ability.statusEffectSpecialDefense = req.body.statusEffectSpecialDefense;
	};
	if (req.body.statusEffectSpeed !== null) {
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

/**
 * Middleware to retrieve an ability by ID and attach it to the response object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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

export default router;