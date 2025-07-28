// importing libraries using the import syntax favoured by ES6
import express from "express";
import LanguageAbilities from "../models/modelLanguageAbilities.js";
import { error } from "console";

const router = express.Router();

// CREATE one
router.post("/", async (req, res) => {
  const languageAbility = new LanguageAbilities({
    name: req.body.name,
    languageAbilities: req.body.languageAbilities
  });

  try {
    const newLanguageAbility = await languageAbility.save();
    res.status(201).json(newLanguageAbility);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get("/", async (_, res) => {
  try {
    const languageAbility = await LanguageAbility.find();
    res.json(languageAbility);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});


// dynamic endpoints (READ/UPDATE/DELETE one)
router
.route("/:id")
.get(getLanguageAbility, (_, res) => {
  res.json(res.languageAbility);
})
.patch(getLanguageAbility, async (req, res) => {
  if (req.body.name !== null) {
    res.languageAbility.name = req.body.name;
  };
  if (req.body.battleDialogue !== null) {
    res.languageAbility.languageAbilities = req.body.languageAbilities;
  };

  try {
    const updatedDialogue = await res.languageAbility.save();
    res.json(updatedDialogue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.delete(getLanguageAbility, async (_, res) => {
  try {
    await Dialogue.deleteOne({ _id: res.languageAbility._id });
    res.json({ message: "Deleted dialogue" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

// middleware to get id
async function getLanguageAbility(req, res, next) {
  let languageAbility;
  try {
    languageAbility = await LanguageAbility.findById(req.params.id);
    if (languageAbility === null) {
      return res.status(404).json({ message: "Can't find language ability" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.languageAbility = languageAbility;
  next();
};

// export
export default router;