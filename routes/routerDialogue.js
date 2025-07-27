// importing libraries using the import syntax favoured by ES6
import express from "express";
import Dialogue from "../models/modelDialogue.js";
import { error } from "console";

const router = express.Router();

// CREATE one
router.post("/", async (req, res) => {
  const dialogue = new Dialogue({
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

// READ all
router.get("/", async (_, res) => {
  try {
    const dialogue = await Dialogue.find();
    res.json(dialogue);
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
});


// dynamic endpoints (READ/UPDATE/DELETE one)
router
.route("/:id")
.get(getDialogue, (_, res) => {
  res.json(res.dialogue);
})
.patch(getDialogue, async (req, res) => {
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

// middleware to get id
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

// export
export default router;