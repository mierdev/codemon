#!/usr/bin/env node

/**
 * API Data Logger - Tests API endpoints and logs all data
 * This script fetches all data from the Codemon API and displays it in the console
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

// Helper function to make requests
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
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
            success: response.ok
        };
    } catch (error) {
        return {
            status: 0,
            data: error.message,
            success: false
        };
    }
}

// Helper function to log data with formatting
function logData(title, data, status) {
    console.log('\n' + '='.repeat(60));
    console.log(`📊 ${title.toUpperCase()}`);
    console.log('='.repeat(60));
    console.log(`Status: ${status}`);
    console.log(`Endpoint: ${BASE_URL}${title.toLowerCase()}`);
    console.log('-'.repeat(60));
    
    if (Array.isArray(data)) {
        console.log(`📋 Found ${data.length} items:`);
        if (data.length === 0) {
            console.log('   No data found');
        } else {
            data.forEach((item, index) => {
                console.log(`\n${index + 1}. ${item.name || item._id || 'Unnamed Item'}:`);
                console.log(JSON.stringify(item, null, 2));
            });
        }
    } else if (typeof data === 'object') {
        console.log('📋 Data:');
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log('📋 Data:');
        console.log(data);
    }
}

// Test individual endpoints
async function testAbilities() {
    console.log('\n🔍 Testing Abilities API...');
    const result = await fetchData('/abilities');
    
    if (result.success) {
        logData('Abilities', result.data, result.status);
        
        // Additional analysis
        if (Array.isArray(result.data)) {
            const types = [...new Set(result.data.map(item => item.type))];
            const avgPower = result.data.reduce((sum, item) => sum + (item.power || 0), 0) / result.data.length;
            const avgAccuracy = result.data.reduce((sum, item) => sum + (item.accuracy || 0), 0) / result.data.length;
            
            console.log('\n📈 Abilities Analysis:');
            console.log(`   Total Abilities: ${result.data.length}`);
            console.log(`   Types: ${types.join(', ')}`);
            console.log(`   Average Power: ${avgPower.toFixed(1)}`);
            console.log(`   Average Accuracy: ${avgAccuracy.toFixed(1)}%`);
        }
    } else {
        console.log(`❌ Failed to fetch abilities: ${result.status} - ${result.data}`);
    }
}

async function testCodemon() {
    console.log('\n🔍 Testing Codemon API...');
    const result = await fetchData('/codemon');
    
    if (result.success) {
        logData('Codemon', result.data, result.status);
        
        // Additional analysis
        if (Array.isArray(result.data)) {
            const types = [...new Set(result.data.map(item => item.type))];
            const avgAbilities = result.data.reduce((sum, item) => sum + (item.abilities?.length || 0), 0) / result.data.length;
            
            console.log('\n📈 Codemon Analysis:');
            console.log(`   Total Codemon: ${result.data.length}`);
            console.log(`   Types: ${types.join(', ')}`);
            console.log(`   Average Abilities per Codemon: ${avgAbilities.toFixed(1)}`);
        }
    } else {
        console.log(`❌ Failed to fetch codemon: ${result.status} - ${result.data}`);
    }
}

async function testTrainers() {
    console.log('\n🔍 Testing Trainers API...');
    const result = await fetchData('/trainers');
    
    if (result.success) {
        logData('Trainers', result.data, result.status);
        
        // Additional analysis
        if (Array.isArray(result.data)) {
            const avgCodemon = result.data.reduce((sum, item) => sum + (item.codemon?.length || 0), 0) / result.data.length;
            
            console.log('\n📈 Trainers Analysis:');
            console.log(`   Total Trainers: ${result.data.length}`);
            console.log(`   Average Codemon per Trainer: ${avgCodemon.toFixed(1)}`);
        }
    } else {
        console.log(`❌ Failed to fetch trainers: ${result.status} - ${result.data}`);
    }
}

async function testDialogue() {
    console.log('\n🔍 Testing Dialogue API...');
    const result = await fetchData('/dialogue');
    
    if (result.success) {
        logData('Dialogue', result.data, result.status);
        
        // Additional analysis
        if (Array.isArray(result.data)) {
            console.log('\n📈 Dialogue Analysis:');
            console.log(`   Total Dialogue Entries: ${result.data.length}`);
        }
    } else {
        console.log(`❌ Failed to fetch dialogue: ${result.status} - ${result.data}`);
    }
}

async function testRootRoute() {
    console.log('\n🔍 Testing Root Route...');
    const result = await fetchData('/');
    
    console.log('\n' + '='.repeat(60));
    console.log('🏠 ROOT ROUTE');
    console.log('='.repeat(60));
    console.log(`Status: ${result.status}`);
    console.log(`Endpoint: ${BASE_URL}/`);
    console.log('-'.repeat(60));
    
    if (result.success) {
        console.log('✅ Root route is accessible');
        console.log('📋 Response type: HTML/EJS template');
    } else {
        console.log(`❌ Root route failed: ${result.status} - ${result.data}`);
    }
}

async function testStaticFiles() {
    console.log('\n🔍 Testing Static Files...');
    
    const staticFiles = [
        '/css/style.css',
        '/js/main.js',
        '/managers/GameManager.js',
        '/assets/audio/effects/physical.mp3'
    ];
    
    console.log('\n' + '='.repeat(60));
    console.log('📁 STATIC FILES');
    console.log('='.repeat(60));
    
    for (const file of staticFiles) {
        const result = await fetchData(file);
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${file}: ${result.status}`);
    }
}

async function testErrorHandling() {
    console.log('\n🔍 Testing Error Handling...');
    
    const errorTests = [
        { endpoint: '/nonexistent', expectedStatus: 404, description: 'Non-existent route' },
        { endpoint: '/abilities/invalid-id', expectedStatus: 500, description: 'Invalid ID format' }
    ];
    
    console.log('\n' + '='.repeat(60));
    console.log('🚨 ERROR HANDLING');
    console.log('='.repeat(60));
    
    for (const test of errorTests) {
        const result = await fetchData(test.endpoint);
        const status = result.status === test.expectedStatus ? '✅' : '❌';
        console.log(`${status} ${test.description}: ${result.status} (expected ${test.expectedStatus})`);
    }
}

// Main function to run all tests
async function runAllTests() {
    console.log('🚀 Starting Codemon API Data Logger...');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    try {
        await testRootRoute();
        await testAbilities();
        await testCodemon();
        await testTrainers();
        await testDialogue();
        await testStaticFiles();
        await testErrorHandling();
        
        console.log('\n' + '='.repeat(60));
        console.log('🎉 API DATA LOGGING COMPLETE');
        console.log('='.repeat(60));
        console.log('📊 All endpoints have been tested and data logged above.');
        console.log('💡 Use this information to understand your current database state.');
        
    } catch (error) {
        console.error('\n💥 Error during API testing:', error.message);
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests();
}

export { runAllTests, fetchData, logData }; 