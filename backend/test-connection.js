require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

console.log('Testing MongoDB connection...\n');
console.log('Connection string preview:', mongoUri.substring(0, 30) + '...\n');

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✓ Successfully connected to MongoDB!');
    console.log('✓ Database:', mongoose.connection.db.databaseName);
    console.log('✓ Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ Connection failed!\n');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\nThis is a DNS resolution error. Possible causes:');
      console.error('1. Incorrect cluster hostname in connection string');
      console.error('2. Network connectivity issues');
      console.error('3. Firewall blocking DNS queries');
      console.error('4. MongoDB Atlas cluster might be paused or deleted');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\nAuthentication failed. Check:');
      console.error('1. Username is correct');
      console.error('2. Password is correct (no special characters need URL encoding)');
    }
    
    if (error.message.includes('IP')) {
      console.error('\nIP address not whitelisted. In MongoDB Atlas:');
      console.error('1. Go to Network Access');
      console.error('2. Add your current IP or 0.0.0.0/0 (all IPs)');
    }
    
    process.exit(1);
  });
