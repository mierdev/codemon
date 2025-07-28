import express from "express";
import Trainer from "../models/modelTrainers.js";
import { error } from "console";

const router = express.Router();

/**
 * Creates a new trainer in the database
 * @param {Object} req - Express request object containing trainer data
 * @param {Object} res - Express response object
 */
router.post("/", async (req, res) => {
  const trainer = new Trainer({
    name: req.body.name,
    codemon: req.body.codemon
  });

  try {
    const newTrainer = await trainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Retrieves all trainers from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", async (_, res) => {
  try {
    const trainer = await Trainer.find();
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET: Retrieves a specific trainer by ID
 * PATCH: Updates a specific trainer by ID
 * DELETE: Removes a specific trainer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router
.route("/:id")
.get(getTrainer, (_, res) => {
  res.json(res.trainer);
})
.patch(getTrainer, async (req, res) => {
  if (req.body.name !== null) {
    res.trainer.name = req.body.name;
  };
  if (req.body.battleDialogue !== null) {
    res.trainer.codemon = req.body.codemon;
  };

  try {
    const updatedTrainer = await res.trainer.save();
    res.json(updatedTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.delete(getTrainer, async (_, res) => {
  try {
    await Trainer.deleteOne({ _id: res.trainer._id });
    res.json({ message: "Deleted trainer" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

/**
 * Middleware to retrieve a trainer by ID and attach it to the response object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getTrainer(req, res, next) {
  let trainer;
  try {
    trainer = await Trainer.findById(req.params.id);
    if (trainer === null) {
      return res.status(404).json({ message: "Can't find trainer" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.trainer = trainer;
  next();
};

export default router;