// Example: Date Serialization in JavaScript/TypeScript

console.log('=== WHAT HAPPENS WHEN DATES ARE SERIALIZED ===')

// 1. Creating a Date object in JavaScript
const originalDate = new Date('2025-09-24T10:30:00.000Z')
console.log('Original Date object:', originalDate)
console.log('Type:', typeof originalDate)
console.log('Can call .getFullYear():', originalDate.getFullYear()) // ✅ Works

console.log('\n--- JSON.stringify() converts Date to string ---')

// 2. When you JSON.stringify (what happens in API responses)
const serializedData = JSON.stringify({
  id: '123',
  title: 'My Chat',
  createdAt: originalDate, // This becomes a string!
  updatedAt: originalDate, // This becomes a string!
})

console.log('Serialized JSON:', serializedData)
// Output: {"id":"123","title":"My Chat","createdAt":"2025-09-24T10:30:00.000Z","updatedAt":"2025-09-24T10:30:00.000Z"}

console.log("\n--- JSON.parse() doesn't restore Date objects ---")

// 3. When you JSON.parse (what happens when receiving API data)
const parsedData = JSON.parse(serializedData)
console.log('Parsed data:', parsedData)
console.log('createdAt type:', typeof parsedData.createdAt) // "string" ❌
console.log('updatedAt type:', typeof parsedData.updatedAt) // "string" ❌

console.log('\n--- The Problem: Trying to call Date methods on strings ---')

try {
  // This is what was happening in your dateUtils.ts
  console.log(parsedData.createdAt.getFullYear()) // ❌ ERROR!
} catch (error) {
  console.log('ERROR:', error.message) // "date.getFullYear is not a function"
}

console.log('\n--- The Solution: Convert strings back to Date objects ---')

// 4. Convert string back to Date
const restoredDate = new Date(parsedData.createdAt)
console.log('Restored Date object:', restoredDate)
console.log('Type:', typeof restoredDate)
console.log('Can call .getFullYear():', restoredDate.getFullYear()) // ✅ Works again!

console.log('\n=== IN YOUR NUXT APP CONTEXT ===')

// This is what happens in your app:

// SERVER (Repository) - Creates actual Date objects
const serverData = {
  id: 'chat-123',
  title: 'Welcome chat',
  createdAt: new Date(), // ✅ Real Date object
  updatedAt: new Date(), // ✅ Real Date object
}

console.log('Server data types:')
console.log('- createdAt:', typeof serverData.createdAt) // "object" (Date)
console.log('- updatedAt:', typeof serverData.updatedAt) // "object" (Date)

// API RESPONSE - Gets serialized to JSON
const apiResponse = JSON.stringify(serverData)
console.log('\nAPI Response (JSON):', apiResponse)

// CLIENT (Frontend) - Receives strings, not Date objects
const clientData = JSON.parse(apiResponse)
console.log('\nClient data types:')
console.log('- createdAt:', typeof clientData.createdAt) // "string" ❌
console.log('- updatedAt:', typeof clientData.updatedAt) // "string" ❌

// BEFORE FIX - dateUtils.ts expected Date objects
function oldDateUtils(date) {
  // date is actually a string like "2025-09-24T10:30:00.000Z"
  return date.getFullYear() // ❌ ERROR: date.getFullYear is not a function
}

// Demonstrate the old function failing
console.log('\n--- Demonstrating the old function error ---')
try {
  oldDateUtils(clientData.createdAt) // This will fail!
} catch (error) {
  console.log('Old function ERROR:', error.message)
}

// AFTER FIX - dateUtils.ts handles both strings and Date objects
function newDateUtils(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getFullYear() // ✅ Works with both strings and Date objects
}

console.log('\n--- Testing the fixed function ---')
console.log('With string:', newDateUtils('2025-09-24T10:30:00.000Z'))
console.log('With Date object:', newDateUtils(new Date()))
