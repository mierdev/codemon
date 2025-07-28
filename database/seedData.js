import Ability from '../models/modelAbilities.js';
import Codemon from '../models/modelCodemon.js';
import Trainer from '../models/modelTrainers.js';
import Dialogue from '../models/modelDialogue.js';

const seedData = async () => {
  try {
    // Clear existing data
    await Ability.deleteMany({});
    await Codemon.deleteMany({});
    await Trainer.deleteMany({});
    await Dialogue.deleteMany({});

    // Seed abilities
    const abilities = await Ability.insertMany([
      /*
      { 	
        name: "",
        type: "" ,
        description: "",
        power: "",
        accuracy: "",
        statusEffectAttack: "",
        statusEffectSpecialAttack: "",
        statusEffectDefense: "",
        statusEffectSpecialDefense: "",
        statusEffectSpeed: ""
      },
      */
      {
        name: "Fire Blast",
        type: "Special",
        description: "A powerful fire attack",
        power: 110,
        accuracy: 85,
        statusEffectDefense: -10,
        statusEffectSpecialDefense: -10
      },
      {
        name: "Thunderbolt",
        type: "Special",
        description: "A powerful electric attack",
        power: 90,
        accuracy: 100,
        statusEffectAttack: -5
      }
    ]);

    // Seed codemon
    const codemon = await Codemon.insertMany([
      {
        name: "Charizard",
        type: "Fire/Flying",
        abilities: ["Fire Blast", "Dragon Claw", "Air Slash"]
      },
      {
        name: "Pikachu",
        type: "Electric",
        abilities: ["Thunderbolt", "Quick Attack", "Thunder Wave"]
      }
    ]);

    // Seed dialogue
    const dialogue = await Dialogue.insertMany([
      {
        startDialogue: "Welcome to my gym!",
        battleDialogue: "Let's see what you've got!"
      },
      {
        startDialogue: "Are you ready for a water battle?",
        battleDialogue: "My water types will wash you away!"
      }
    ]);

    // Seed trainers
    const trainers = await Trainer.insertMany([
      {
        name: "Ash Ketchum",
        codemon: ["Charizard", "Pikachu"],
        dialogue: "I choose you!"
      },
      {
        name: "Misty",
        codemon: ["Starmie", "Goldeen"],
        dialogue: "Water types are the best!"
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Added ${abilities.length} abilities`);
    console.log(`Added ${codemon.length} codemon`);
    console.log(`Added ${trainers.length} trainers`);
    console.log(`Added ${dialogue.length} dialogue entries`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedData;