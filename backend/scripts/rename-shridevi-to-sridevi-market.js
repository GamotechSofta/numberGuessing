/**
 * One-time script: change market name from "Shridevi" to "sridevi"
 * (Market schema stores uppercase, so DB will have "SRIDEVI")
 * Run: node scripts/rename-shridevi-to-sridevi-market.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Market = require('../models/Market');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Market.updateMany(
    { $or: [{ name: 'SHRIDEVI' }, { name: 'Shridevi' }] },
    { $set: { name: 'SRIDEVI' } }
  );
  console.log(`Updated ${result.modifiedCount} market(s) from Shridevi to SRIDEVI`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
