// importing libraries using the import syntax favoured by ES6
import express from "express";
import Trainer from "../models/modelTrainers.js";
import { error } from "console";

const router = express.Router();

// CREATE one
router.post("/", async (req, res) => {
  const trainer = new Trainer({
    name: req.body.name,
    codemon: req.body.codemon,
    dialogue: req.body.dialogue
  });

  try {
    const newTrainer = await trainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all
router.get("/", async (_, res) => {
  try {
    const trainer = await Trainer.find();
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});


// dynamic endpoints (READ/UPDATE/DELETE one)
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
    if (req.body.dialogue !== null) {
    res.trainer.dialogue = req.body.dialogue;
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

// middleware to get id
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

// export
export default router;