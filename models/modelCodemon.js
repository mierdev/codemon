// importing with ES6 syntax
import mongoose from "mongoose";

// setup schema
const codemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, 
  },
  image: {
    type: String,
    required: true,

  },
  area: {
    type: String,
    required: true,

  },
  abilities: {
    type: Object,
    required: true
  }
});

// export
export default mongoose.model("Codemon", codemonSchema);