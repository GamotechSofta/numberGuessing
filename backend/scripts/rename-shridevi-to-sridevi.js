/**
 * One-time script: change marketName "SHRIDEVI" to "SRIDEVI"
 * Run: node scripts/rename-shridevi-to-sridevi.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const DailyResult = require('../models/DailyResult');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await DailyResult.updateMany(
    { marketName: 'SHRIDEVI' },
    { $set: { marketName: 'SRIDEVI' } }
  );
  console.log(`Updated ${result.modifiedCount} record(s) from SHRIDEVI to SRIDEVI`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
