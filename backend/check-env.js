require('dotenv').config();

console.log('Checking .env file...\n');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI is not set in .env file');
  console.log('\nPlease add to your .env file:');
  console.log('MONGO_URI=your_mongodb_connection_string');
  process.exit(1);
}

console.log('MONGO_URI found:');
console.log('Length:', mongoUri.length, 'characters');

// Show first and last 20 characters (hide sensitive data)
const preview = mongoUri.length > 40 
  ? mongoUri.substring(0, 20) + '...' + mongoUri.substring(mongoUri.length - 20)
  : mongoUri.substring(0, Math.min(40, mongoUri.length)) + '...';

console.log('Preview:', preview);
console.log('');

// Validate format
if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  console.error('❌ Invalid format!');
  console.error('MONGO_URI must start with "mongodb://" or "mongodb+srv://"');
  console.log('\nExamples:');
  console.log('Local:    mongodb://localhost:27017/matka');
  console.log('Atlas:    mongodb+srv://username:password@cluster.mongodb.net/matka');
  process.exit(1);
}

if (mongoUri.length < 20) {
  console.error('❌ Connection string seems too short!');
  console.error('A valid MongoDB connection string should be much longer.');
  process.exit(1);
}

// Check for common issues
if (mongoUri.includes('<password>') || mongoUri.includes('<dbname>')) {
  console.error('❌ Connection string contains placeholders!');
  console.error('Please replace <password> and <dbname> with actual values');
  process.exit(1);
}

if (/^\d+$/.test(mongoUri.trim())) {
  console.error('❌ Connection string appears to be just a number!');
  console.error('This is not a valid MongoDB connection string.');
  process.exit(1);
}

console.log('✓ Format looks valid!');
console.log('\nIf you still get connection errors:');
console.log('1. Make sure MongoDB is running (if local)');
console.log('2. Check your network connection (if Atlas)');
console.log('3. Verify your MongoDB credentials');
console.log('4. Check IP whitelist in MongoDB Atlas (if using Atlas)');
