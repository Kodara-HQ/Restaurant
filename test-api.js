// Simple API test script for Restaurant Hub Backend
// Run this after starting the server to test basic functionality

const BASE_URL = 'http://localhost:5000';

// Test functions
async function testHealthCheck() {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testGetRestaurants() {
  try {
    const response = await fetch(`${BASE_URL}/api/restaurants`);
    const data = await response.json();
    console.log('✅ Get Restaurants:', data.message);
    console.log(`   Found ${data.data?.length || 0} restaurants`);
    return true;
  } catch (error) {
    console.error('❌ Get Restaurants Failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  try {
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'User'
    };

    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ User Registration:', data.message);
      console.log(`   User ID: ${data.data.user.id}`);
      return data.data.token; // Return token for further tests
    } else {
      console.error('❌ User Registration Failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ User Registration Error:', error.message);
    return null;
  }
}

async function testUserLogin() {
  try {
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ User Login:', data.message);
      return data.data.token;
    } else {
      console.log('⚠️  User Login:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ User Login Error:', error.message);
    return null;
  }
}

async function testGetMenuItems() {
  try {
    const response = await fetch(`${BASE_URL}/api/menu/items`);
    const data = await response.json();
    console.log('✅ Get Menu Items:', data.message);
    console.log(`   Found ${data.data?.length || 0} menu items`);
    return true;
  } catch (error) {
    console.error('❌ Get Menu Items Failed:', error.message);
    return false;
  }
}

async function testGetMenuCategories() {
  try {
    const response = await fetch(`${BASE_URL}/api/menu/categories`);
    const data = await response.json();
    console.log('✅ Get Menu Categories:', data.message);
    console.log(`   Found ${data.data?.length || 0} categories`);
    return true;
  } catch (error) {
    console.error('❌ Get Menu Categories Failed:', error.message);
    return false;
  }
}

async function testAuthenticatedEndpoint(token) {
  if (!token) {
    console.log('⚠️  Skipping authenticated endpoint test - no token available');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Authenticated Endpoint:', data.message);
      console.log(`   User: ${data.data.first_name} ${data.data.last_name}`);
      return true;
    } else {
      console.error('❌ Authenticated Endpoint Failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Authenticated Endpoint Error:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Restaurant Hub Backend API Tests...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Health Check
  totalTests++;
  if (await testHealthCheck()) passedTests++;
  console.log('');

  // Test 2: Get Restaurants
  totalTests++;
  if (await testGetRestaurants()) passedTests++;
  console.log('');

  // Test 3: Get Menu Items
  totalTests++;
  if (await testGetMenuItems()) passedTests++;
  console.log('');

  // Test 4: Get Menu Categories
  totalTests++;
  if (await testGetMenuCategories()) passedTests++;
  console.log('');

  // Test 5: User Registration
  totalTests++;
  const token = await testUserRegistration();
  if (token) passedTests++;
  console.log('');

  // Test 6: User Login (if test user exists)
  totalTests++;
  const loginToken = await testUserLogin();
  if (loginToken) passedTests++;
  console.log('');

  // Test 7: Authenticated Endpoint
  totalTests++;
  const testToken = token || loginToken;
  if (await testAuthenticatedEndpoint(testToken)) passedTests++;
  console.log('');

  // Test Results
  console.log('📊 Test Results:');
  console.log(`   Passed: ${passedTests}/${totalTests}`);
  console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above and verify your setup.');
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests().catch(console.error);
} else {
  // Browser environment
  runTests().catch(console.error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testHealthCheck,
    testGetRestaurants,
    testUserRegistration,
    testUserLogin,
    testGetMenuItems,
    testGetMenuCategories,
    testAuthenticatedEndpoint,
    runTests
  };
}
