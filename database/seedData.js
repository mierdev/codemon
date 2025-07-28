import mongoose from "mongoose";
import dotenv from "dotenv";
import Ability from '../models/modelAbilities.js';
import Codemon from '../models/modelCodemon.js';
import Dialogue from '../models/modelDialogue.js';
import LanguageAbilities from '../models/modelLanguageAbilities.js';
import Trainer from '../models/modelTrainers.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Ability.deleteMany({});
    await Codemon.deleteMany({});
    await Dialogue.deleteMany({});
    await LanguageAbilities.deleteMany({});
    await Trainer.deleteMany({});

    // Seed abilities
    const abilities = await Ability.insertMany([
      {
      name: "Rapid Prototype",
      type: "Passive",
      description: "Starts battle with +10 Speed bonus. Status effects last 1 less turn.",
      power: "28",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "10"
    },
    {
      name: "Ecosystem Call",
      type: "Utility",
      description: "Temporarily gains a secondary type for 3 turns.",
      power: "28",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Fast Compilation",
      type: "Physical",
      description: "Quick attack with 30% chance to reduce target's Speed by 1 stage.",
      power: "25",
      accuracy: "90",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "-1"
    },
    {
      name: "Goroutine Swarm",
      type: "Special",
      description: "Deals special damage. 25% chance to inflict 'Concurrency Lock'.",
      power: "35",
      accuracy: "85",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Borrow Checker",
      type: "Defensive",
      description: "Reduces incoming damage by 40%. 20% chance to reflect damage.",
      power: "25",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "2",
      statusEffectSpecialDefense: "2",
      statusEffectSpeed: "0"
    },
    {
      name: "Zero-Cost Abstraction",
      type: "Special",
      description: "Deals special damage. 35% chance to inflict 'Memory Leak'.",
      power: "25",
      accuracy: "80",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Type Inference",
      type: "Passive",
      description: "All abilities gain +10% accuracy. +15% crit vs multi-type targets.",
      power: "24",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Pattern Matching",
      type: "Special",
      description: "Deals special damage. +25 bonus vs C++ and JS/TS.",
      power: "44",
      accuracy: "85",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Garbage Collection",
      type: "Recovery",
      description: "Heals 30% max HP and removes one debuff. 25% chance to gain +1 Defense.",
      power: "25",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "1",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "LINQ Query",
      type: "Special",
      description: "Deals special damage. 30% chance to inflict 'Data Binding Error'.",
      power: "45",
      accuracy: "85",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Asynchronous Promise",
      type: "Special",
      description: "Deals initial damage + 25 delayed damage. 25% chance of Callback Hell.",
      power: "48",
      accuracy: "75",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    },
    {
      name: "Framework Flux",
      type: "Passive",
      description: "40% chance each turn to gain +1 random stat. 10% chance to lose -1.",
      power: "38",
      accuracy: "100",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0"
    }
    ]);

    // Seed codemon
    const codemon = await Codemon.insertMany([
      {
      name: "Python",
      type: "Interpreted/Dynamic",
      description: "Versatile language with rapid prototyping capabilities",
      power: "85",
      accuracy: "90",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/snake.png",
      area: "../assets/background/grasslands.png"
    },
    {
      name: "Go",
      type: "Compiled/Concurrent",
      description: "Fast compilation and built-in concurrency support",
      power: "90",
      accuracy: "85",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/gopher.png",
      area: "../assets/background/desert.png"
    },
    {
      name: "Rust",
      type: "Systems/Memory-Safe",
      description: "Memory safety without garbage collection",
      power: "95",
      accuracy: "80",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/crab.png",
      area: "../assets/background/grasslands.png"
    },
    {
      name: "OCaml",
      type: "Functional/Type-Safe",
      description: "Advanced type system with pattern matching",
      power: "80",
      accuracy: "95",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/camel.png",
      area: "../assets/background/desert.png"
    },
    {
      name: "C#",
      type: "Managed/Enterprise",
      description: "Microsoft's managed language with rich ecosystem",
      power: "85",
      accuracy: "85",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/windows_logo.png",
      area: "../assets/background/cave.png"
    },
    {
      name: "JavaScript & TypeScript",
      type: "Web/Script",
      description: "Dynamic web language with type safety option",
      power: "70",
      accuracy: "90",
      statusEffectAttack: "0",
      statusEffectSpecialAttack: "0",
      statusEffectDefense: "0",
      statusEffectSpecialDefense: "0",
      statusEffectSpeed: "0",
      imagePath: "../assets/codemon/birb.png",
      area: "../assets/background/grasslands.png"
    }
    ]);

    // Seed dialogue
    const dialogue = await Dialogue.insertMany([
      {
        name: "Nallo",
        startDialogue: "Welcome to my gym!",
        battleDialogue: "Let's see what you've got!"
      },
      {
        name: "Gert",
        startDialogue: "Are you ready for a water battle?",
        battleDialogue: "My water types will wash you away!"
      }
    ]);

     const languageAbilities = await LanguageAbilities.insertMany([
      {
        name: "python",
        languageAbilities: ["Rapid Prototype", "Ecosystem Call"]
      },
      {
        name: "go",
        languageAbilities: ["Fast Compilation", "Goroutine Swarm"]
      },
      {
        name: "rust",
        languageAbilities: ["Borrow Checker", "Zero-Cost Abstraction"]
      },
      {
        name: "ocaml",
        languageAbilities: ["Type Inference", "Pattern Matching"]
      },
      {
        name: "csharp",
        languageAbilities: ["Garbage Collection", "LINQ Query"]
      },
      {
        name: "javascript",
        languageAbilities: ["Asynchronous Promise", "Framework Flux"]
      }
     ]);

    // Seed trainers
    const trainers = await Trainer.insertMany([
      {
        name: "Nallo",
        codemon: "javascript"
      },
      {
        name: "Gert",
        codemon: "python"
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Added ${abilities.length} abilities`);
    console.log(`Added ${codemon.length} codemon`);
    console.log(`Added ${dialogue.length} dialogue entries`);
    console.log(`Added ${languageAbilities.length} language abilities`);
    console.log(`Added ${trainers.length} trainers`);

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error seeding database:', error);
    // Close the database connection even on error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed after error.');
    }
  }
};

export default seedData;