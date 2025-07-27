// importing with ES6 syntax
import mongoose from "mongoose";

// setup schema
const trainersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  codemon: {
    type: Object,
    required: true,
  },
  dialogue: {
    type: Object,
    required: true
  }
});

// export
export default mongoose.model("Trainers", trainersSchema);