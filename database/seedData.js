import mongoose from "mongoose";
import dotenv from "dotenv";
import Ability from '../models/modelAbilities.js';
import Codemon from '../models/modelCodemon.js';
import Dialogue from '../models/modelDialogue.js';
import LanguageAbilities from '../models/modelLanguageAbilities.js';
import Trainer from '../models/modelTrainers.js';

dotenv.config();

/**
 * Seeds the database with initial game data including abilities, codemon, dialogue, language abilities, and trainers
 * Connects to MongoDB, clears existing data, and inserts new seed data for all collections
 * @returns {Promise<void>} Resolves when seeding is complete or rejects on error
 */
const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Ability.deleteMany({});
    await Codemon.deleteMany({});
    await Dialogue.deleteMany({});
    await LanguageAbilities.deleteMany({});
    await Trainer.deleteMany({});

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

    const dialogue = await Dialogue.insertMany([
      {
        name: "Gert",
        startDialogue: "Ready to code?",
        battleDialogue: ["Let's see what you've got!", "Time to test your skills!", "Show me your best!"],
        winDialogue: "Well done!",
        loseDialogue: "Better luck next time!"
      },
      {
        name: "Miranda",
        startDialogue: "Hello there!",
        battleDialogue: ["Let's battle!", "Time to fight!", "Show me your moves!"],
        winDialogue: "Great job!",
        loseDialogue: "Don't give up!"
      },
      {
        name: "birbMiranda",
        startDialogue: "Hello there!",
        battleDialogue: ["Let's battle!", "Time to fight!", "Show me your moves!"],
        winDialogue: "Great job!",
        loseDialogue: "Don't give up!"
      },
      {
        name: "TokiLoshi",
        startDialogue: "Hey there!",
        battleDialogue: ["Let's do this!", "Time to battle!", "Show me what you got!"],
        winDialogue: "Excellent!",
        loseDialogue: "Keep trying!"
      },
      {
        name: "Dan",
        startDialogue: "Ready to fight?",
        battleDialogue: ["Let's go!", "Time to test!", "Show me your skills!"],
        winDialogue: "Well played!",
        loseDialogue: "You'll get better!"
      },
      {
        name: "Karma Glitch",
        startDialogue: "Can you use Google?",
        battleDialogue: ["Let's see!", "Time to battle!", "Show me your moves!"],
        winDialogue: "Impressive!",
        loseDialogue: "Keep learning!"
      },
      {
        name: "Lane",
        startDialogue: "Hello!",
        battleDialogue: ["Let's fight!", "Time to battle!", "Show me your best!"],
        winDialogue: "Great work!",
        loseDialogue: "Don't stop trying!"
      },
      {
        name: "Lyle",
        startDialogue: "Want to battle? Let's SSGo!",
        battleDialogue: ["Let's do this!", "Time to fight!", "Show me your skills!"],
        winDialogue: "Excellent job!",
        loseDialogue: "Keep practicing!"
      },
      {
        name: "Ipê",
        startDialogue: "Ready to code?",
        battleDialogue: ["Let's battle!", "Time to test!", "Show me your moves!"],
        winDialogue: "Well done!",
        loseDialogue: "Keep improving!"
      },
      {
        name: "Nallo",
        startDialogue: "Hello there!",
        battleDialogue: ["Let's fight!", "Time to battle!", "Show me your best!"],
        winDialogue: "Great job!",
        loseDialogue: "Don't give up!"
      },
      {
        name: "birbNallo",
        startDialogue: "Hello there!",
        battleDialogue: ["Let's fight!", "Time to battle!", "Show me your best!"],
        winDialogue: "Great job!",
        loseDialogue: "Don't give up!"
      },
      {
        name: "Zillhar",
        startDialogue: "Ready to fight?",
        battleDialogue: ["Let's go!", "Time to test!", "Show me your skills!"],
        winDialogue: "Well played!",
        loseDialogue: "Keep trying!"
      },
      {
        name: "Wasseem",
        startDialogue: "Hello!",
        battleDialogue: ["Let's battle!", "Time to fight!", "Show me your moves!"],
        winDialogue: "Excellent!",
        loseDialogue: "Keep learning!"
      },
      {
        name: "Ryan",
        startDialogue: "Ready to code?",
        battleDialogue: ["Let's do this!", "Time to battle!", "Show me your best!"],
        winDialogue: "Great work!",
        loseDialogue: "Don't stop trying!"
      },
      {
        name: "Zieba",
        startDialogue: "Hello there!",
        battleDialogue: ["Let's fight!", "Time to test!", "Show me your skills!"],
        winDialogue: "Well done!",
        loseDialogue: "Keep improving!"
      },
      {
        name: "Nuc",
        startDialogue: "ANA is abandoned!",
        battleDialogue: ["Let's battle!", "Time to fight!", "Show me your moves!"],
        winDialogue: "Great job!",
        loseDialogue: "I'm surrounded by old people."
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

    const trainers = await Trainer.insertMany([
      // Python trainers
      {
        name: "Miranda",
        codemon: "python"
      },
      {
        name: "Gert",
        codemon: "python"
      },
      // JavaScript & TypeScript trainers
      {
        name: "TokiLoshi",
        codemon: "javascript"
      },
      {
        name: "Dan",
        codemon: "javascript"
      },
      {
        name: "Karma Glitch",
        codemon: "javascript"
      },
      {
        name: "birbMiranda",
        codemon: "javascript"
      },
      {
        name: "birbNallo",
        codemon: "javascript"
      },
      // Go trainers
      {
        name: "Lane",
        codemon: "go"
      },
      {
        name: "Lyle",
        codemon: "go"
      },
      {
        name: "Ipê",
        codemon: "go"
      },
      // Rust trainers
      {
        name: "Nallo",
        codemon: "rust"
      },
      {
        name: "Zillhar",
        codemon: "rust"
      },
      // OCaml trainers
      {
        name: "Ryan",
        codemon: "ocaml"
      },
      {
        name: "Wasseem",
        codemon: "ocaml"
      },
      // C# trainers
      {
        name: "Zieba",
        codemon: "csharp"
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Added ${abilities.length} abilities`);
    console.log(`Added ${codemon.length} codemon`);
    console.log(`Added ${dialogue.length} dialogue entries`);
    console.log(`Added ${languageAbilities.length} language abilities`);
    console.log(`Added ${trainers.length} trainers`);

    await mongoose.connection.close();
    console.log('Database connection closed.');

  } catch (error) {
    console.error('Error seeding database:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed after error.');
    }
  }
};

export default seedData;