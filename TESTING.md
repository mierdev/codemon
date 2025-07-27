# Testing Guide for Codemon API

This document explains how to test all the routes in the Codemon project.

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run devStart
   ```

3. **Make sure MongoDB is running:**
   ```bash
   # If you have MongoDB installed locally
   mongod
   
   # Or if using MongoDB Atlas, make sure your connection string is correct
   ```

## Testing Methods

### Method 1: Automated Test Runner (Recommended)

Run the comprehensive test suite:

```bash
npm test
# or
npm run test:api
```

This will:
- Test all CRUD operations for each route
- Test error handling
- Test static file serving
- Provide detailed pass/fail results
- Show a summary at the end

### Method 2: REST Client (VS Code)

1. **Install the REST Client extension** in VS Code
2. **Open `testApi.rest`** in VS Code
3. **Run individual tests** by clicking "Send Request" above each request
4. **Run all tests** with `Ctrl+Alt+R` (or `Cmd+Alt+R` on Mac)

### Method 3: Manual Testing with curl

```bash
# Test root route
curl http://localhost:3001/

# Test abilities routes
curl http://localhost:3001/abilities
curl -X POST http://localhost:3001/abilities -H "Content-Type: application/json" -d '{"name":"Test","type":"Physical","description":"Test","power":50,"accuracy":85}'

# Test codemon routes
curl http://localhost:3001/codemon
curl -X POST http://localhost:3001/codemon -H "Content-Type: application/json" -d '{"name":"Test","type":"Fire","abilities":[]}'

# Test trainers routes
curl http://localhost:3001/trainers
curl -X POST http://localhost:3001/trainers -H "Content-Type: application/json" -d '{"name":"Test","codemon":[],"dialogue":"Hello"}'

# Test dialogue routes
curl http://localhost:3001/dialogue
curl -X POST http://localhost:3001/dialogue -H "Content-Type: application/json" -d '{"startDialogue":"Hello","battleDialogue":"Fight"}'
```

## Routes Being Tested

### 1. Root Route (`/`)
- **GET** `/` - Renders the main page

### 2. Abilities Routes (`/abilities`)
- **GET** `/abilities` - Get all abilities
- **POST** `/abilities` - Create new ability
- **GET** `/abilities/:id` - Get ability by ID
- **PATCH** `/abilities/:id` - Update ability
- **DELETE** `/abilities/:id` - Delete ability

### 3. Codemon Routes (`/codemon`)
- **GET** `/codemon` - Get all codemon
- **POST** `/codemon` - Create new codemon
- **GET** `/codemon/:id` - Get codemon by ID
- **PATCH** `/codemon/:id` - Update codemon
- **DELETE** `/codemon/:id` - Delete codemon

### 4. Trainers Routes (`/trainers`)
- **GET** `/trainers` - Get all trainers
- **POST** `/trainers` - Create new trainer
- **GET** `/trainers/:id` - Get trainer by ID
- **PATCH** `/trainers/:id` - Update trainer
- **DELETE** `/trainers/:id` - Delete trainer

### 5. Dialogue Routes (`/dialogue`)
- **GET** `/dialogue` - Get all dialogue
- **POST** `/dialogue` - Create new dialogue
- **GET** `/dialogue/:id` - Get dialogue by ID
- **PATCH** `/dialogue/:id` - Update dialogue
- **DELETE** `/dialogue/:id` - Delete dialogue

### 6. Static Files
- **GET** `/css/style.css` - CSS files
- **GET** `/js/main.js` - JavaScript files
- **GET** `/managers/GameManager.js` - Manager files
- **GET** `/assets/audio/effects/*.mp3` - Audio files

### 7. Error Handling
- **GET** `/nonexistent` - 404 errors
- **GET** `/abilities/invalid-id` - Invalid ID format errors

## Test Data

The automated tests use the following sample data:

### Ability
```json
{
  "name": "Test Ability",
  "type": "Physical",
  "description": "A test ability for testing purposes",
  "power": 50,
  "accuracy": 85,
  "statusEffectAttack": 1,
  "statusEffectSpecialAttack": 0,
  "statusEffectDefense": -1,
  "statusEffectSpecialDefense": 0,
  "statusEffectSpeed": 0
}
```

### Codemon
```json
{
  "name": "Test Codemon",
  "type": "Fire",
  "abilities": ["Test Ability", "Special Test Ability"]
}
```

### Trainer
```json
{
  "name": "Test Trainer",
  "codemon": ["Test Codemon"],
  "dialogue": "Hello, I am a test trainer!"
}
```

### Dialogue
```json
{
  "startDialogue": "Welcome to the battle!",
  "battleDialogue": "Let's see what you've got!"
}
```

## Expected Test Results

### Successful Tests
- ✅ All CRUD operations return appropriate status codes (200, 201, 404)
- ✅ Data is properly created, retrieved, updated, and deleted
- ✅ Error handling works correctly
- ✅ Static files are accessible
- ✅ Root route renders correctly

### Common Issues
- ❌ MongoDB not running (connection errors)
- ❌ Server not started (connection refused)
- ❌ Invalid JSON in request body
- ❌ Missing required fields in POST requests

## Troubleshooting

### Server Connection Issues
```bash
# Check if server is running
curl http://localhost:3001/

# Check server logs
npm run devStart
```

### MongoDB Issues
```bash
# Check MongoDB status
mongosh
# or
mongo

# Check connection string in server.js
```

### Test Runner Issues
```bash
# Install missing dependencies
npm install

# Check Node.js version (should be 16+)
node --version
```

## Continuous Integration

To integrate testing into your development workflow:

1. **Pre-commit hooks:** Run tests before committing
2. **GitHub Actions:** Automate testing on push/PR
3. **Docker:** Include tests in container builds

Example GitHub Actions workflow:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Contributing

When adding new routes or modifying existing ones:

1. **Update the test suite** in `testRunner.js`
2. **Add test cases** for new functionality
3. **Update this documentation** with new routes
4. **Run the full test suite** before submitting PRs

## Support

If you encounter issues with testing:

1. Check the server logs for errors
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check the test output for specific failure details 