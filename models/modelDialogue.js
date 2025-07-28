// importing with ES6 syntax
import mongoose from "mongoose";

// setup schema
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
  }
});

// export
export default mongoose.model("Dialogue", dialogueSchema);