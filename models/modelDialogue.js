import mongoose from "mongoose";

/**
 * Mongoose schema for Dialogue model
 * Defines the structure for dialogue data including name, start dialogue, and battle dialogue
 */
const dialogueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDialogue: {
    type: String,
    required: true,
  },
  battleDialogue: {
    type: Array,
    required: true
  },
  winDialogue: {
    type: String,
    required: true,
  },
  loseDialogue: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Dialogue", dialogueSchema);