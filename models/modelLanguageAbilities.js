import mongoose from "mongoose";

/**
 * Mongoose schema for LanguageAbilities model
 * Defines the structure for language abilities data including name and associated abilities array
 */
const languageAbilitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  languageAbilities: {
    type: Array,
    required: true
  }
});

export default mongoose.model("LanguageAbilities", languageAbilitiesSchema);