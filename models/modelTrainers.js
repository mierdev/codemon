import mongoose from "mongoose";

/**
 * Mongoose schema for Trainer model
 * Defines the structure for trainer data including name and associated codemon
 */
const trainersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codemon: {
    type: String,
    required: true,
  }
});

export default mongoose.model("Trainer", trainersSchema);