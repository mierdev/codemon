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
  description: {
    type: String,
    required: true
  },
  statusEffectAttack: {
    type: Number,
    required: true,
    default: "0"
  },
  statusEffectSpecialAttack: {
    type: Number,
    required: true,
    default: "0"
  },
  statusEffectDefense: {
    type: Number,
    required: true,
    default: "0"
  },
  statusEffectSpecialDefense: {
    type: Number,
    required: true,
    default: "0"
  },
  statusEffectSpeed: {
    type: Number,
    required: true,
    default: "0"
  },
  imagePath: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,

  }
});

// export
export default mongoose.model("Codemon", codemonSchema);