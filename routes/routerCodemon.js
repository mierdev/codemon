// importing libraries using the import syntax favoured by ES6
import express from "express";
import Codemon from "../models/modelCodemon.js";
import { error } from "console";

const router = express.Router();

// CREATE one
router.post("/", async (req, res) => {
  const codemon = new Codemon({
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
    imagePath: req.body.imagePath,
    area: req.body.area,
    abilities: req.body.abilities
  });

  try {
    const newCodemon = await codemon.save();
    res.status(201).json(newCodemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get("/", async (_, res) => {
  try {
    const codemon = await Codemon.find();
    res.json(codemon);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});


// dynamic endpoints (READ/UPDATE/DELETE one)
router
.route("/:id")
.get(getCodemon, (_, res) => {
  res.json(res.codemon);
})
.patch(getCodemon, async (req, res) => {
  if (req.body.name !== null) {
    res.codemon.name = req.body.name;
  };
  if (req.body.type !== null) {
    res.codemon.type = req.body.type;
  };
  if (req.body.description !== null) {
		res.codemon.description = req.body.description;
	};
	if (req.body.power !== null) {
		res.codemon.power = req.body.power;
	};
	if (req.body.accuracy !== null) {
		res.codemon.accuracy = req.body.accuracy;
	};
	if (req.body.statusEffectAttack !== null) {
		res.codemon.statusEffectAttack = req.body.statusEffectAttack;
	};
	if (req.body.statusEffectSpecialAttack !== null) {
		res.codemon.statusEffectSpecialAttack = req.body.statusEffectSpecialAttack;
	};
	if (req.body.statusEffectDefense !== null) {
		res.codemon.statusEffectDefense = req.body.statusEffectDefense;
	};
	if (req.body.statusEffectSpecialDefense !== null) {
		res.codemon.statusEffectSpecialDefense = req.body.statusEffectSpecialDefense;
	};
	if (req.body.statusEffectSpeed !== null) {
		res.codemon.statusEffectSpeed = req.body.statusEffectSpeed;
	};
  if (req.body.imagePath !== null) {
    res.codemon.imagePath = req.body.imagePath;
  };
  if (req.body.area !== null) {
    res.codemon.area = req.body.area;
  };
  if (req.body.abilities !== null) {
    res.codemon.abilities = req.body.abilities;
  };

  try {
    const updatedCodemon = await res.codemon.save();
    res.json(updatedCodemon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.delete(getCodemon, async (_, res) => {
  try {
    await Codemon.deleteOne({ _id: res.codemon._id });
    res.json({ message: "Deleted codemon" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// middleware to get id
async function getCodemon(req, res, next) {
  let codemon;
  try {
    codemon = await Codemon.findById(req.params.id);
    if (codemon === null) {
      return res.status(404).json({ message: "Can't find codemon" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.codemon = codemon;
  next();
};

// export
export default router;