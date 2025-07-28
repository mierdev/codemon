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
        startDialogue: "Tomorrow I hope will be the end of DSA (then SSG :brokenarmor:",
        battleDialogue: ["Greatness comes from chaos!! 🔥 🔥", "Did you choose violence today :bootslol:", "You all are bots."],
        winDialogue: "Woke up from DSA brain melt and get wordle in 2 :bootspog:)",
        loseDialogue: "But know I haven't forgotten about timing you out Miranda! 😠"
      },
      {
        name: "Miranda",
        startDialogue: "Loops throw you for a loop when starting out.",
        battleDialogue: ["It's more Pythonic.", "Oh no, not more currying pls :bootsfear:", "BRING THE PAIN !!! :hard:"],
        winDialogue: "Great job!",
        loseDialogue: "I’m old I don’t remember things."
      },
      {
        name: "birbMiranda",
        startDialogue: "TypeScript has enums.",
        battleDialogue: ["Easily beaten with enums.", "Just finished the Union chapter, they are neat.", "'G'o do some html and css and vanilla javascript."],
        winDialogue: "I love JavaScript.",
        loseDialogue: "You do realize JavaScript is everywhere and you’ll never be able to escape it?"
      },
      {
        name: "TokiLoshi",
        startDialogue: "Birds are happy creatures :bootsheart:",
        battleDialogue: ["Kinda looks like a ducky :rubberduck:", "Ok, that's pretty cute :bootsheart:", "Fine, keep your secrets."],
        winDialogue: "I predicted the shiny.",
        loseDialogue: "So much I still want to add and polish."
      },
      {
        name: "Dan",
        startDialogue: "It's important to keep reminding people that TypeScript has enums.",
        battleDialogue: ["Don't stop bullying.", "Just a lot of soy manual enjoyers here.", "Kinda verbose."],
        winDialogue: "Did lane forget to mention bonus points if it's in js/ts? :bootsthink:",
        loseDialogue: "Non-sarcastically added it to the backlog :bootspray:"
      },
      {
        name: "Karma Glitch",
        startDialogue: "Can you use Google?",
        battleDialogue: ["Shiiiiiit.", "Fat bear.", "we have TS which is far more superior, am i right?"],
        winDialogue: "I would love a cup of Java.",
        loseDialogue: "Streak has zero value in reality."
      },
      {
        name: "Lane",
        startDialogue: "I don't have anything with Java installed, when in doubt, provide instructions.",
        battleDialogue: ["I never took notes in school.", "Slay.", "Can anyone hear me?"],
        winDialogue: "Not hard to look things up these days.",
        loseDialogue: "Effin got me"
      },
      {
        name: "Lyle",
        startDialogue: "There is no SSGo.",
        battleDialogue: ["It do be a little slow.", "You're the reason my parser handles inline hot garbage", "At least it's not JS/TS..."],
        winDialogue: "If I can't have a little fun then what's the point?",
        loseDialogue: "You could say the go team doesn't give one iota about enums :KEKWlaugh:"
      },
      {
        name: "Ipê",
        startDialogue: "Welcome to the first floor!",
        battleDialogue: ["Btw their intro is incredibly sus.", "Yes, its not a very good idea.", "At least the code is not in russian."],
        winDialogue: "I'm not sure what to make of this.",
        loseDialogue: "I would ban but i dont wanna step on anybody's icey toes."
      },
      {
        name: "Nallo",
        startDialogue: "Rust error handling is just peak.",
        battleDialogue: ["Rapier is Rust based right? :bootspog:", "All paths lead to rust", "Woah rust devs are not furries."],
        winDialogue: "And we know how rust feels about pointers...",
        loseDialogue: "Rust is dead! Long live Visual Basic!"
      },
      {
        name: "birbNallo",
        startDialogue: "It’s got types in so I assume it’s typescript.",
        battleDialogue: ["TypeScript has enums.", "Birb starting strong today.", "Why is that cat about to eat the birb?"],
        winDialogue: "Is this how Java gives birth to Javascript?",
        loseDialogue: "We live in a world of OOP between C, C++, JavaScript, Python."
      },
      {
        name: "Zillhar",
        startDialogue: "Sometimes you just have to play along to get along.",
        battleDialogue: ["I suggest you take it.", "Get em!", "Yea do what you want."],
        winDialogue: "My son is an Archwizzer after all.",
        loseDialogue: "Time to reverse some of the glaze with some haze."
      },
      {
        name: "Waseem",
        startDialogue: "The rule of thumb is that if something is there people are gonna use it.",
        battleDialogue: ["We are so FPing.", "Gotta love regex (not)", "That definitely works."],
        winDialogue: "True and true.",
        loseDialogue: "Then it's not completely fixed yet, I'll get back on it."
      },
      {
        name: "Ryan",
        startDialogue: "Oh hi there :bootspog:",
        battleDialogue: ["Unfortunately :bootssad:", "Sounds really nice! ", "Gl hf"],
        winDialogue: "THE CAML STRIKES AGAIN",
        loseDialogue: "Never tried gleam but heard great things about it."
      },
      {
        name: "Zieba",
        startDialogue: "Blazor is the shit.",
        battleDialogue: ["They are all good.", "Bro.", "Salesforce is a menace."],
        winDialogue: "My theory is that because I told it to be a teenager, it is mocking me.",
        loseDialogue: "RIP coding."
      },
      {
        name: "Nuc",
        startDialogue: "I abandoned ANA.",
        battleDialogue: ["I see.", "Oh dear.", "I... don't know"],
        winDialogue: "Also, I was bored.",
        loseDialogue: "I love the language and its ecosystem, I just don’t like the language server."
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
        name: "Waseem",
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