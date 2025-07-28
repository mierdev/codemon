// importing with ES6 syntax
import mongoose from "mongoose";

// setup schema
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

// export
export default mongoose.model("LanguageAbilities", languageAbilitiesSchema);