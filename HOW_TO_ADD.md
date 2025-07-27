# How to Add Information to the Codemon Database

This guide explains how to add, modify, and manage data in the Codemon database through various methods.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Structure](#database-structure)
3. [Method 1: CRUD API Operations](#method-1-crud-api-operations)
4. [Method 2: Direct Database Methods](#method-2-direct-database-methods)
5. [Method 3: Database Seeding](#method-3-database-seeding)
6. [Testing Your Changes](#testing-your-changes)
7. [Best Practices](#best-practices)

## Prerequisites

Before adding data to the database, ensure you have:

1. **MongoDB running locally:**
   ```bash
   mongod
   ```

2. **Server running:**
   ```bash
   npm run devStart
   ```

3. **Dependencies installed:**
   ```bash
   npm install
   ```

## Database Structure

The Codemon database contains four main collections:

### 1. Abilities Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  type: String (required),
  description: String (required),
  power: Number,
  accuracy: Number,
  statusEffectAttack: Number,
  statusEffectSpecialAttack: Number,
  statusEffectDefense: Number,
  statusEffectSpecialDefense: Number,
  statusEffectSpeed: Number
}
```

### 2. Codemon Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  type: String (required),
  abilities: [String] (required)
}
```

### 3. Trainers Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  codemon: [String] (required),
  dialogue: String (required)
}
```

### 4. Dialogue Collection
```javascript
{
  _id: ObjectId,
  startDialogue: String (required),
  battleDialogue: String (required)
}
```

## Method 1: CRUD API Operations

### Using the REST API

#### 1.1 Adding Abilities

**POST** `http://localhost:3001/abilities`

```bash
curl -X POST http://localhost:3001/abilities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fire Blast",
    "type": "Special",
    "description": "A powerful fire attack",
    "power": 110,
    "accuracy": 85,
    "statusEffectAttack": 0,
    "statusEffectSpecialAttack": 0,
    "statusEffectDefense": 0,
    "statusEffectSpecialDefense": 0,
    "statusEffectSpeed": 0
  }'
```

**Using REST Client (VS Code):**
```http
POST http://localhost:3001/abilities
Content-Type: application/json

{
  "name": "Fire Blast",
  "type": "Special",
  "description": "A powerful fire attack",
  "power": 110,
  "accuracy": 85,
  "statusEffectAttack": 0,
  "statusEffectSpecialAttack": 0,
  "statusEffectDefense": 0,
  "statusEffectSpecialDefense": 0,
  "statusEffectSpeed": 0
}
```

#### 1.2 Adding Codemon

**POST** `http://localhost:3001/codemon`

```bash
curl -X POST http://localhost:3001/codemon \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charizard",
    "type": "Fire/Flying",
    "abilities": ["Fire Blast", "Dragon Claw", "Air Slash"]
  }'
```

#### 1.3 Adding Trainers

**POST** `http://localhost:3001/trainers`

```bash
curl -X POST http://localhost:3001/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ash Ketchum",
    "codemon": ["Charizard", "Pikachu"],
    "dialogue": "I choose you!"
  }'
```

#### 1.4 Adding Dialogue

**POST** `http://localhost:3001/dialogue`

```bash
curl -X POST http://localhost:3001/dialogue \
  -H "Content-Type: application/json" \
  -d '{
    "startDialogue": "Welcome to my gym!",
    "battleDialogue": "Let\'s see what you\'ve got!"
  }'
```

### Updating Existing Data

#### 1.5 Updating Abilities

**PATCH** `http://localhost:3001/abilities/{id}`

```bash
curl -X PATCH http://localhost:3001/abilities/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "power": 120,
    "accuracy": 90
  }'
```

#### 1.6 Deleting Data

**DELETE** `http://localhost:3001/abilities/{id}`

```bash
curl -X DELETE http://localhost:3001/abilities/507f1f77bcf86cd799439011
```

## Method 2: Direct Database Methods

### 2.1 Using MongoDB Compass (GUI)

1. **Connect to MongoDB:**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Select database: `dbCodemon`

2. **Add Documents:**
   - Click on the collection (e.g., `abilities`)
   - Click "Add Data" → "Insert Document"
   - Paste your JSON document
   - Click "Insert"

### 2.2 Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to database
use dbCodemon

# Insert ability
db.abilities.insertOne({
  name: "Thunderbolt",
  type: "Special",
  description: "A powerful electric attack",
  power: 90,
  accuracy: 100,
  statusEffectAttack: 0,
  statusEffectSpecialAttack: 0,
  statusEffectDefense: 0,
  statusEffectSpecialDefense: 0,
  statusEffectSpeed: 0
})

# Insert codemon
db.codemon.insertOne({
  name: "Pikachu",
  type: "Electric",
  abilities: ["Thunderbolt", "Quick Attack", "Thunder Wave"]
})

# Insert trainer
db.trainers.insertOne({
  name: "Misty",
  codemon: ["Starmie", "Goldeen"],
  dialogue: "Water types are the best!"
})

# Insert dialogue
db.dialogue.insertOne({
  startDialogue: "Are you ready for a water battle?",
  battleDialogue: "My water types will wash you away!"
})
```

### 2.3 Bulk Operations

```javascript
// Insert multiple abilities at once
db.abilities.insertMany([
  {
    name: "Ice Beam",
    type: "Special",
    description: "A freezing beam of ice",
    power: 90,
    accuracy: 100,
    statusEffectAttack: 0,
    statusEffectSpecialAttack: 0,
    statusEffectDefense: 0,
    statusEffectSpecialDefense: 0,
    statusEffectSpeed: 0
  },
  {
    name: "Earthquake",
    type: "Physical",
    description: "A powerful ground attack",
    power: 100,
    accuracy: 100,
    statusEffectAttack: 0,
    statusEffectSpecialAttack: 0,
    statusEffectDefense: 0,
    statusEffectSpecialDefense: 0,
    statusEffectSpeed: 0
  }
])
```

## Method 3: Database Seeding

### 3.1 Creating Seed Files

Create a new file `database/seedData.js`:

```javascript
import mongoose from 'mongoose';
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
      {
        name: "Fire Blast",
        type: "Special",
        description: "A powerful fire attack",
        power: 110,
        accuracy: 85,
        statusEffectAttack: 0,
        statusEffectSpecialAttack: 0,
        statusEffectDefense: 0,
        statusEffectSpecialDefense: 0,
        statusEffectSpeed: 0
      },
      {
        name: "Thunderbolt",
        type: "Special",
        description: "A powerful electric attack",
        power: 90,
        accuracy: 100,
        statusEffectAttack: 0,
        statusEffectSpecialAttack: 0,
        statusEffectDefense: 0,
        statusEffectSpecialDefense: 0,
        statusEffectSpeed: 0
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
```

### 3.2 Running Seed Script

Add to `package.json`:

```json
{
  "scripts": {
    "seed": "node -e \"import('./database/seedData.js').then(m => m.default())\""
  }
}
```

Run the seed script:

```bash
npm run seed
```

## Testing Your Changes

### 4.1 Using the Test Suite

```bash
# Run all tests
npm test

# Test specific endpoints
curl http://localhost:3001/abilities
curl http://localhost:3001/codemon
curl http://localhost:3001/trainers
curl http://localhost:3001/dialogue
```

### 4.2 Manual Verification

```bash
# Check if data was added
curl http://localhost:3001/abilities | jq
curl http://localhost:3001/codemon | jq
curl http://localhost:3001/trainers | jq
curl http://localhost:3001/dialogue | jq
```

## Best Practices

### 5.1 Data Validation

- **Required Fields**: Always include required fields (`name`, `type`, `description` for abilities)
- **Data Types**: Ensure correct data types (numbers for power/accuracy, strings for names)
- **Unique Names**: Consider making names unique to avoid duplicates

### 5.2 Error Handling

```javascript
// Example of proper error handling
try {
  const newAbility = await ability.save();
  console.log('Ability created:', newAbility);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### 5.3 Data Consistency

- **References**: When adding codemon, ensure referenced abilities exist
- **Relationships**: Maintain consistency between trainers and their codemon
- **Updates**: Use PATCH for partial updates, PUT for complete replacements

### 5.4 Performance

- **Bulk Operations**: Use `insertMany()` for multiple documents
- **Indexes**: Consider adding indexes for frequently queried fields
- **Validation**: Use MongoDB schema validation for data integrity

## Troubleshooting

### Common Issues

1. **Connection Errors:**
   ```bash
   # Check if MongoDB is running
   mongosh
   ```

2. **Validation Errors:**
   - Check required fields are present
   - Verify data types are correct
   - Ensure no duplicate unique fields

3. **Server Errors:**
   ```bash
   # Check server logs
   npm run devStart
   ```

### Useful Commands

```bash
# Check database status
mongosh --eval "db.stats()"

# List all collections
mongosh dbCodemon --eval "show collections"

# Count documents in collection
mongosh dbCodemon --eval "db.abilities.countDocuments()"

# Find specific document
mongosh dbCodemon --eval "db.abilities.findOne({name: 'Fire Blast'})"
```

## Next Steps

1. **Explore the API**: Use the test suite to understand all available endpoints
2. **Add Custom Data**: Create your own abilities, codemon, trainers, and dialogue
3. **Extend the Schema**: Add new fields to existing models as needed
4. **Create Relationships**: Link data between collections using references
5. **Implement Validation**: Add custom validation rules for your data

For more information, see the [API Documentation](TESTING.md) and [Database Models](../models/). 