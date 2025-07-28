import express from "express";
import Dialogue from "../models/modelDialogue.js";
import { error } from "console";

const router = express.Router();

/**
 * Creates a new dialogue entry in the database
 * @param {Object} req - Express request object containing dialogue data
 * @param {Object} res - Express response object
 */
router.post("/", async (req, res) => {
  const dialogue = new Dialogue({
    name: req.body.name,
    startDialogue: req.body.startDialogue,
    battleDialogue: req.body.battleDialogue
  });

  try {
    const newDialogue = await dialogue.save();
    res.status(201).json(newDialogue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Retrieves all dialogue entries from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", async (_, res) => {
  try {
    const dialogue = await Dialogue.find();
    res.json(dialogue);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET: Retrieves a specific dialogue entry by ID
 * PATCH: Updates a specific dialogue entry by ID
 * DELETE: Removes a specific dialogue entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router
.route("/:id")
.get(getDialogue, (_, res) => {
  res.json(res.dialogue);
})
.patch(getDialogue, async (req, res) => {
  if (req.body.name !== null) {
    res.dialogue.name = req.body.name;
  };
  if (req.body.startDialogue !== null) {
    res.dialogue.startDialogue = req.body.startDialogue;
  };
  if (req.body.battleDialogue !== null) {
    res.dialogue.battleDialogue = req.body.battleDialogue;
  };

  try {
    const updatedDialogue = await res.dialogue.save();
    res.json(updatedDialogue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.delete(getDialogue, async (_, res) => {
  try {
    await Dialogue.deleteOne({ _id: res.dialogue._id });
    res.json({ message: "Deleted dialogue" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

/**
 * Middleware to retrieve a dialogue entry by ID and attach it to the response object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getDialogue(req, res, next) {
  let dialogue;
  try {
    dialogue = await Dialogue.findById(req.params.id);
    if (dialogue === null) {
      return res.status(404).json({ message: "Can't find dialogue" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.dialogue = dialogue;
  next();
};

export default router;