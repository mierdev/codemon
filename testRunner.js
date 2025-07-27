#!/usr/bin/env node

/**
 * Automated Test Runner for Codemon API
 * Tests all routes and provides detailed results
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';
const TEST_RESULTS = {
    passed: 0,
    failed: 0,
    errors: []
};

// Test data
const testData = {
    ability: {
        name: "Test Ability",
        type: "Physical",
        description: "A test ability for testing purposes",
        power: 50,
        accuracy: 85,
        statusEffectAttack: 1,
        statusEffectSpecialAttack: 0,
        statusEffectDefense: -1,
        statusEffectSpecialDefense: 0,
        statusEffectSpeed: 0
    },
    codemon: {
        name: "Test Codemon",
        type: "Fire",
        abilities: ["Test Ability", "Special Test Ability"]
    },
    trainer: {
        name: "Test Trainer",
        codemon: ["Test Codemon"],
        dialogue: "Hello, I am a test trainer!"
    },
    dialogue: {
        startDialogue: "Welcome to the battle!",
        battleDialogue: "Let's see what you've got!"
    }
};

// Helper function to make requests
async function makeRequest(method, url, body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${BASE_URL}${url}`, options);
        const data = await response.text();
        
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch {
            jsonData = data;
        }
        
        return {
            status: response.status,
            data: jsonData,
            headers: response.headers
        };
    } catch (error) {
        return {
            status: 0,
            data: error.message,
            headers: {}
        };
    }
}

// Test helper function
function assert(condition, message) {
    if (condition) {
        TEST_RESULTS.passed++;
        console.log(`✅ ${message}`);
    } else {
        TEST_RESULTS.failed++;
        TEST_RESULTS.errors.push(message);
        console.log(`❌ ${message}`);
    }
}

// Test functions
async function testRootRoute() {
    console.log('\n=== Testing Root Route ===');
    const response = await makeRequest('GET', '/');
    assert(response.status === 200, 'Root route should return 200');
}

async function testAbilitiesRoutes() {
    console.log('\n=== Testing Abilities Routes ===');
    
    // Test GET all abilities
    const getAllResponse = await makeRequest('GET', '/abilities');
    assert(getAllResponse.status === 200, 'GET /abilities should return 200');
    
    // Test POST create ability
    const createResponse = await makeRequest('POST', '/abilities', testData.ability);
    assert(createResponse.status === 201, 'POST /abilities should return 201');
    
    if (createResponse.status === 201 && createResponse.data._id) {
        const abilityId = createResponse.data._id;
        
        // Test GET ability by ID
        const getByIdResponse = await makeRequest('GET', `/abilities/${abilityId}`);
        assert(getByIdResponse.status === 200, 'GET /abilities/:id should return 200');
        
        // Test PATCH update ability
        const updateResponse = await makeRequest('PATCH', `/abilities/${abilityId}`, {
            power: 80,
            accuracy: 95
        });
        assert(updateResponse.status === 200, 'PATCH /abilities/:id should return 200');
        
        // Test DELETE ability
        const deleteResponse = await makeRequest('DELETE', `/abilities/${abilityId}`);
        assert(deleteResponse.status === 200, 'DELETE /abilities/:id should return 200');
    }
    
    // Test GET non-existent ability
    const notFoundResponse = await makeRequest('GET', '/abilities/507f1f77bcf86cd799439011');
    assert(notFoundResponse.status === 404, 'GET non-existent ability should return 404');
}

async function testCodemonRoutes() {
    console.log('\n=== Testing Codemon Routes ===');
    
    // Test GET all codemon
    const getAllResponse = await makeRequest('GET', '/codemon');
    assert(getAllResponse.status === 200, 'GET /codemon should return 200');
    
    // Test POST create codemon
    const createResponse = await makeRequest('POST', '/codemon', testData.codemon);
    assert(createResponse.status === 201, 'POST /codemon should return 201');
    
    if (createResponse.status === 201 && createResponse.data._id) {
        const codemonId = createResponse.data._id;
        
        // Test GET codemon by ID
        const getByIdResponse = await makeRequest('GET', `/codemon/${codemonId}`);
        assert(getByIdResponse.status === 200, 'GET /codemon/:id should return 200');
        
        // Test PATCH update codemon
        const updateResponse = await makeRequest('PATCH', `/codemon/${codemonId}`, {
            name: "Updated Test Codemon",
            type: "Fire/Flying"
        });
        assert(updateResponse.status === 200, 'PATCH /codemon/:id should return 200');
        
        // Test DELETE codemon
        const deleteResponse = await makeRequest('DELETE', `/codemon/${codemonId}`);
        assert(deleteResponse.status === 200, 'DELETE /codemon/:id should return 200');
    }
    
    // Test GET non-existent codemon
    const notFoundResponse = await makeRequest('GET', '/codemon/507f1f77bcf86cd799439011');
    assert(notFoundResponse.status === 404, 'GET non-existent codemon should return 404');
}

async function testTrainersRoutes() {
    console.log('\n=== Testing Trainers Routes ===');
    
    // Test GET all trainers
    const getAllResponse = await makeRequest('GET', '/trainers');
    assert(getAllResponse.status === 200, 'GET /trainers should return 200');
    
    // Test POST create trainer
    const createResponse = await makeRequest('POST', '/trainers', testData.trainer);
    assert(createResponse.status === 201, 'POST /trainers should return 201');
    
    if (createResponse.status === 201 && createResponse.data._id) {
        const trainerId = createResponse.data._id;
        
        // Test GET trainer by ID
        const getByIdResponse = await makeRequest('GET', `/trainers/${trainerId}`);
        assert(getByIdResponse.status === 200, 'GET /trainers/:id should return 200');
        
        // Test PATCH update trainer
        const updateResponse = await makeRequest('PATCH', `/trainers/${trainerId}`, {
            name: "Updated Test Trainer",
            dialogue: "I have been updated!"
        });
        assert(updateResponse.status === 200, 'PATCH /trainers/:id should return 200');
        
        // Test DELETE trainer
        const deleteResponse = await makeRequest('DELETE', `/trainers/${trainerId}`);
        assert(deleteResponse.status === 200, 'DELETE /trainers/:id should return 200');
    }
    
    // Test GET non-existent trainer
    const notFoundResponse = await makeRequest('GET', '/trainers/507f1f77bcf86cd799439011');
    assert(notFoundResponse.status === 404, 'GET non-existent trainer should return 404');
}

async function testDialogueRoutes() {
    console.log('\n=== Testing Dialogue Routes ===');
    
    // Test GET all dialogue
    const getAllResponse = await makeRequest('GET', '/dialogue');
    assert(getAllResponse.status === 200, 'GET /dialogue should return 200');
    
    // Test POST create dialogue
    const createResponse = await makeRequest('POST', '/dialogue', testData.dialogue);
    assert(createResponse.status === 201, 'POST /dialogue should return 201');
    
    if (createResponse.status === 201 && createResponse.data._id) {
        const dialogueId = createResponse.data._id;
        
        // Test GET dialogue by ID
        const getByIdResponse = await makeRequest('GET', `/dialogue/${dialogueId}`);
        assert(getByIdResponse.status === 200, 'GET /dialogue/:id should return 200');
        
        // Test PATCH update dialogue
        const updateResponse = await makeRequest('PATCH', `/dialogue/${dialogueId}`, {
            startDialogue: "Updated welcome message!",
            battleDialogue: "Updated battle message!"
        });
        assert(updateResponse.status === 200, 'PATCH /dialogue/:id should return 200');
        
        // Test DELETE dialogue
        const deleteResponse = await makeRequest('DELETE', `/dialogue/${dialogueId}`);
        assert(deleteResponse.status === 200, 'DELETE /dialogue/:id should return 200');
    }
    
    // Test GET non-existent dialogue
    const notFoundResponse = await makeRequest('GET', '/dialogue/507f1f77bcf86cd799439011');
    assert(notFoundResponse.status === 404, 'GET non-existent dialogue should return 404');
}

async function testErrorHandling() {
    console.log('\n=== Testing Error Handling ===');
    
    // Test 404 route
    const notFoundResponse = await makeRequest('GET', '/nonexistent');
    assert(notFoundResponse.status === 404, 'Non-existent route should return 404');
    
    // Test invalid ID format
    const invalidIdResponse = await makeRequest('GET', '/abilities/invalid-id');
    assert(invalidIdResponse.status === 500, 'Invalid ID format should return 500');
}

async function testStaticFiles() {
    console.log('\n=== Testing Static Files ===');
    
    // Test CSS file
    const cssResponse = await makeRequest('GET', '/css/style.css');
    assert(cssResponse.status === 200, 'CSS file should be accessible');
    
    // Test JavaScript file
    const jsResponse = await makeRequest('GET', '/js/main.js');
    assert(jsResponse.status === 200, 'JavaScript file should be accessible');
    
    // Test Manager file
    const managerResponse = await makeRequest('GET', '/managers/GameManager.js');
    assert(managerResponse.status === 200, 'Manager file should be accessible');
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting Codemon API Tests...\n');
    
    try {
        await testRootRoute();
        await testAbilitiesRoutes();
        await testCodemonRoutes();
        await testTrainersRoutes();
        await testDialogueRoutes();
        await testErrorHandling();
        await testStaticFiles();
        
        console.log('\n=== Test Summary ===');
        console.log(`✅ Passed: ${TEST_RESULTS.passed}`);
        console.log(`❌ Failed: ${TEST_RESULTS.failed}`);
        console.log(`📊 Total: ${TEST_RESULTS.passed + TEST_RESULTS.failed}`);
        
        if (TEST_RESULTS.errors.length > 0) {
            console.log('\n❌ Failed Tests:');
            TEST_RESULTS.errors.forEach(error => {
                console.log(`  - ${error}`);
            });
        }
        
        if (TEST_RESULTS.failed === 0) {
            console.log('\n🎉 All tests passed!');
            process.exit(0);
        } else {
            console.log('\n💥 Some tests failed!');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('\n💥 Test runner error:', error.message);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

export { runTests, makeRequest, assert }; 