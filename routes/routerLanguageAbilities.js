import express from "express";
import LanguageAbilities from "../models/modelLanguageAbilities.js";
import Codemon from "../models/modelCodemon.js";
import Ability from "../models/modelAbilities.js";
import Trainer from "../models/modelTrainers.js";
import Dialogue from "../models/modelDialogue.js";
import { error } from "console";

const router = express.Router();

/**
 * Retrieves all language abilities data from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/", async (req, res) => {
  try {
    const languageAbilities = await LanguageAbilities.find();
    res.json(languageAbilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Retrieves combined language and ability data for the game
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/game-data", async (req, res) => {
  try {
    const codemon = await Codemon.find();
    const abilities = await Ability.find();
    const languageAbilities = await LanguageAbilities.find();
    
    // Create a map of ability names to ability objects
    const abilityMap = {};
    abilities.forEach(ability => {
      abilityMap[ability.name] = ability;
    });
    
    // Combine codemon with their abilities
    const gameData = codemon.map(language => {
      // Map codemon names to language ability names
      const nameMapping = {
        'Python': 'python',
        'Go': 'go',
        'Rust': 'rust',
        'OCaml': 'ocaml',
        'C#': 'csharp',
        'JavaScript & TypeScript': 'javascript'
      };
      
      const languageAbilityName = nameMapping[language.name];
      const languageAbilityData = languageAbilities.find(la => la.name === languageAbilityName);
      
      const languageAbilitiesList = languageAbilityData ? languageAbilityData.languageAbilities : [];
      
      // Convert abilities to the format expected by the game
      const gameAbilities = languageAbilitiesList.map(abilityName => {
        const ability = abilityMap[abilityName];
        if (ability) {
          return {
            name: ability.name,
            type: ability.type,
            power: parseInt(ability.power),
            accuracy: parseInt(ability.accuracy),
            description: ability.description,
            cooldown: 0 // Default cooldown
          };
        }
        return null;
      }).filter(ability => ability !== null);
      
      // Map language names to game IDs
      const languageIdMap = {
        'python': 'python',
        'go': 'go',
        'rust': 'rust',
        'ocaml': 'ocaml',
        'csharp': 'csharp',
        'javascript': 'javascript'
      };
      
      const languageId = languageIdMap[languageAbilityName] || languageAbilityName;
      
      return {
        id: languageId,
        name: language.name,
        type: language.type,
        stats: {
          hp: 100,
          maxHp: 100,
          attack: parseInt(language.power) || 75,
          specialAttack: parseInt(language.power) || 75,
          defense: parseInt(language.power) || 75,
          specialDefense: parseInt(language.power) || 75,
          speed: parseInt(language.accuracy) || 75
        },
        abilities: gameAbilities
      };
    });
    
    res.json(gameData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Retrieves trainers for a specific language
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/trainers/:language", async (req, res) => {
  try {
    const { language } = req.params;
    const trainers = await Trainer.find({ codemon: language });
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Retrieves dialogue by trainer name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/dialogue/:trainerName", async (req, res) => {
  try {
    const { trainerName } = req.params;
    const dialogue = await Dialogue.findOne({ name: trainerName });
    if (!dialogue) {
      return res.status(404).json({ message: "Dialogue not found" });
    }
    res.json(dialogue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Creates a new language ability entry in the database
 * @param {Object} req - Express request object containing language ability data
 * @param {Object} res - Express response object
 */
router.post("/", async (req, res) => {
  const languageAbility = new LanguageAbilities({
    name: req.body.name,
    languageAbilities: req.body.languageAbilities
  });

  try {
    const newLanguageAbility = await languageAbility.save();
    res.status(201).json(newLanguageAbility);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET: Retrieves a specific language ability entry by ID
 * PATCH: Updates a specific language ability entry by ID
 * DELETE: Removes a specific language ability entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router
.route("/:id")
.get(getLanguageAbility, (_, res) => {
  res.json(res.languageAbility);
})
.patch(getLanguageAbility, async (req, res) => {
  if (req.body.name !== null) {
    res.languageAbility.name = req.body.name;
  };
  if (req.body.battleDialogue !== null) {
    res.languageAbility.languageAbilities = req.body.languageAbilities;
  };

  try {
    const updatedDialogue = await res.languageAbility.save();
    res.json(updatedDialogue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
.delete(getLanguageAbility, async (_, res) => {
  try {
    await Dialogue.deleteOne({ _id: res.languageAbility._id });
    res.json({ message: "Deleted dialogue" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

/**
 * Middleware to retrieve a language ability entry by ID and attach it to the response object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getLanguageAbility(req, res, next) {
  let languageAbility;
  try {
    languageAbility = await LanguageAbility.findById(req.params.id);
    if (languageAbility === null) {
      return res.status(404).json({ message: "Can't find language ability" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.languageAbility = languageAbility;
  next();
};

export default router;