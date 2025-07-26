// const express = require("express");

/**
 * importing libraries using the import syntax favoured by ES6
 * require is preferred by common js which gives us the .cjs and can often cause headaches
 */
import express from "express";
import Ability from "../models/modelAbilities.js";

const router = express.Router();

// CREATE one
router.post("/", (req, res) => {
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

	res.send(`CREATE ONE ${ability.name}`);
});

// READ all
router.get("/", (req, res) => {
	console.log("Getting all", req);
	res.send("GET ALL");
});

// READ one
router.get("/:id", (req, res) => {
	res.send("GET ONE");
});

// UPDATE one
router.patch("/:id", (req, res) => {
	res.send("UPDATE ONE");
});

// DELETE one
router.delete("/:id", (req, res) => {
	res.send("DELETE ONE");
});

// module.exports = router;
// Updated for ES6
export default router;
