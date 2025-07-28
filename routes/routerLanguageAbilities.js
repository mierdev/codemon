import express from "express";
import LanguageAbilities from "../models/modelLanguageAbilities.js";
import { error } from "console";

const router = express.Router();

/**
 * Creates a new language ability entry in the database
 * @param {Object} req - Express request object containing language ability data
 * @param {Object} res - Express response object
 */
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

/**
 * Retrieves all language ability entries from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", async (_, res) => {
  try {
    const languageAbility = await LanguageAbility.find();
    res.json(languageAbility);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET: Retrieves a specific language ability entry by ID
 * PATCH: Updates a specific language ability entry by ID
 * DELETE: Removes a specific language ability entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

/**
 * Middleware to retrieve a language ability entry by ID and attach it to the response object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
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

export default router;