require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const Market = require('./models/Market');
const LiveResult = require('./models/LiveResult');
const Setting = require('./models/Setting');
const ChartData = require('./models/ChartData');
const DailyResult = require('./models/DailyResult');
const HtmlChartData = require('./models/HtmlChartData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set in .env file');
  console.error('Please create a .env file in the backend folder with:');
  console.error('MONGO_URI=your_mongodb_connection_string');
  console.error('PORT=5000');
  process.exit(1);
}

// Validate MONGO_URI format
const mongoUri = process.env.MONGO_URI.trim();
if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
  console.error('ERROR: Invalid MONGO_URI format');
  console.error('MONGO_URI should start with "mongodb://" or "mongodb+srv://"');
  console.error('Current value:', mongoUri.substring(0, 20) + '...');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    // Initialize default data if collections are empty
    initializeDefaultMarkets();
    initializeDefaultLiveResults();
    initializeDefaultSettings();
    initializeDefaultChartData();
    // Start midnight reset cron job
    startMidnightResetCron();
  })
  .catch((error) => {
    console.error('✗ MongoDB connection error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your MONGO_URI in the .env file');
    console.error('2. For local MongoDB: mongodb://localhost:27017/matka');
    console.error('3. For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname');
    console.error('4. Make sure MongoDB is running (if using local)');
    console.error('5. Check your network connection (if using Atlas)');
    process.exit(1);
  });

// Cron job: Reset all markets at 12 AM (midnight) every day
function startMidnightResetCron() {
  // '0 0 * * *' = At 00:00 (midnight) every day
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running midnight market reset...');
    try {
      const result = await Market.updateMany(
        {},
        { $set: { open: '***', close: '***' } }
      );
      console.log(`[CRON] Reset ${result.modifiedCount} markets at midnight`);
    } catch (error) {
      console.error('[CRON] Error resetting markets:', error.message);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
  console.log('✓ Midnight market reset cron scheduled (12:00 AM IST)');
}

// Initialize default markets
async function initializeDefaultMarkets() {
  try {
    const count = await Market.countDocuments();
    if (count === 0) {
      const defaultMarkets = [
        { name: 'KALYAN', open: '2-5-8', close: '3-6-9' },
        { name: 'MILAN DAY', open: '1-4-7', close: '2-5-8' },
        { name: 'RAJDHANI', open: '4-7-0', close: '5-8-1' },
        { name: 'MAIN MUMBAI', open: '3-6-9', close: '4-7-0' },
        { name: 'TIME BAZAR', open: '6-9-2', close: '7-0-3' }
      ];
      await Market.insertMany(defaultMarkets);
      console.log('Default markets initialized');
    }
  } catch (error) {
    console.error('Error initializing default markets:', error);
  }
}

// Initialize default live results
async function initializeDefaultLiveResults() {
  try {
    const count = await LiveResult.countDocuments();
    if (count === 0) {
      const defaultResults = [
        { name: 'BHOOTNATH NIGHT', result: '390-2', timeRange: '(7:00 PM - 10:00 PM)' },
        { name: 'KARNATAKA NIGHT', result: 'Loading...', timeRange: '(7:15 PM - 8:15 PM)' }
      ];
      await LiveResult.insertMany(defaultResults);
      console.log('Default live results initialized');
    }
  } catch (error) {
    console.error('Error initializing default live results:', error);
  }
}

// Initialize default settings
async function initializeDefaultSettings() {
  try {
    const defaultSettings = [
      { key: 'SITE_NAME', value: 'Dpbossking', description: 'Website name' },
      { key: 'API_ENDPOINT', value: 'http://localhost:5000', description: 'Backend API endpoint' }
    ];
    
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { $setOnInsert: setting },
        { upsert: true, new: true }
      );
    }
    console.log('Default settings initialized');
  } catch (error) {
    console.error('Error initializing default settings:', error);
  }
}

// Initialize default chart data
async function initializeDefaultChartData() {
  try {
    const count = await ChartData.countDocuments();
    if (count === 0) {
      const defaultChart = {
        dateRange: '28-09-2020\nto\n04-10-2020',
        mon: '2\n4\n5',
        tue: '14',
        wed: '1\n6\n7',
        thu: '1\n5\n7',
        fri: '37',
        sat: '1\n8\n8',
        sun: '5\n9\n0'
      };
      await ChartData.create(defaultChart);
      console.log('Default chart data initialized');
    }
  } catch (error) {
    console.error('Error initializing default chart data:', error);
  }
}

// GET all markets
app.get('/api/markets', async (req, res) => {
  try {
    const markets = await Market.find().sort({ createdAt: -1 }).lean();
    const withTimes = markets.map((m) => {
      const opening = m.openingTime != null ? String(m.openingTime).trim() : '';
      const closing = m.closingTime != null ? String(m.closingTime).trim() : '';
      return {
        _id: m._id,
        name: m.name,
        open: m.open,
        close: m.close,
        marketType: m.marketType || 'regular',
        isTopMarket: m.isTopMarket || false,
        openingTime: opening,
        closingTime: closing,
        goldenAnk: m.goldenAnk != null ? String(m.goldenAnk).trim() : '',
        motorPatti: m.motorPatti != null ? String(m.motorPatti).trim() : '',
        // Guessing values for Top Markets section
        guessingSingle: m.guessingSingle || '',
        guessingJodi: m.guessingJodi || '',
        guessingPana: m.guessingPana || '',
        createdAt: m.createdAt,
        updatedAt: m.updatedAt
      };
    });
    res.json(withTimes);
  } catch (error) {
    console.error('Error fetching markets:', error);
    res.status(500).json({ error: 'Failed to fetch markets' });
  }
});

// GET single market by ID
app.get('/api/markets/:id', async (req, res) => {
  try {
    const market = await Market.findById(req.params.id);
    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }
    res.json(market);
  } catch (error) {
    console.error('Error fetching market:', error);
    res.status(500).json({ error: 'Failed to fetch market' });
  }
});

// POST create new market
app.post('/api/markets', async (req, res) => {
  try {
    const { name, open, close, openingTime, closingTime, goldenAnk, motorPatti, marketType } = req.body;
    
    if (!name || !open || !close) {
      return res.status(400).json({ error: 'Name, open, and close are required' });
    }

    const newMarket = new Market({
      name: name.toUpperCase(),
      open,
      close,
      marketType: marketType || 'regular',
      openingTime: openingTime != null ? String(openingTime).trim() : '',
      closingTime: closingTime != null ? String(closingTime).trim() : '',
      goldenAnk: goldenAnk != null ? String(goldenAnk).trim() : '',
      motorPatti: motorPatti != null ? String(motorPatti).trim() : ''
    });

    const savedMarket = await newMarket.save();
    const saved = savedMarket.toObject ? savedMarket.toObject() : savedMarket;
    res.status(201).json({
      ...saved,
      openingTime: saved.openingTime != null ? String(saved.openingTime).trim() : '',
      closingTime: saved.closingTime != null ? String(saved.closingTime).trim() : '',
      goldenAnk: saved.goldenAnk != null ? String(saved.goldenAnk).trim() : '',
      motorPatti: saved.motorPatti != null ? String(saved.motorPatti).trim() : ''
    });
  } catch (error) {
    console.error('Error creating market:', error);
    res.status(500).json({ error: 'Failed to create market' });
  }
});

// PUT update market
app.put('/api/markets/:id', async (req, res) => {
  try {
    const { name, open, close, openingTime, closingTime, goldenAnk, motorPatti, marketType, isTopMarket, guessingSingle, guessingJodi, guessingPana } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name.toUpperCase();
    if (open !== undefined) updateData.open = open;
    if (close !== undefined) updateData.close = close;
    if (marketType !== undefined) updateData.marketType = marketType;
    if (openingTime !== undefined) updateData.openingTime = String(openingTime).trim();
    if (closingTime !== undefined) updateData.closingTime = String(closingTime).trim();
    if (goldenAnk !== undefined) updateData.goldenAnk = String(goldenAnk).trim();
    if (motorPatti !== undefined) updateData.motorPatti = String(motorPatti).trim();
    // Handle isTopMarket flag for Top Markets Guessing
    if (isTopMarket !== undefined) updateData.isTopMarket = Boolean(isTopMarket);
    // Handle guessing values
    if (guessingSingle !== undefined) updateData.guessingSingle = String(guessingSingle).trim();
    if (guessingJodi !== undefined) updateData.guessingJodi = String(guessingJodi).trim();
    if (guessingPana !== undefined) updateData.guessingPana = String(guessingPana).trim();

    const market = await Market.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }

    res.json(market);
  } catch (error) {
    console.error('Error updating market:', error);
    res.status(500).json({ error: 'Failed to update market' });
  }
});

// DELETE market
app.delete('/api/markets/:id', async (req, res) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);
    
    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }

    res.json({ message: 'Market deleted successfully' });
  } catch (error) {
    console.error('Error deleting market:', error);
    res.status(500).json({ error: 'Failed to delete market' });
  }
});

// POST reset all markets (manual trigger)
app.post('/api/markets/reset-all', async (req, res) => {
  try {
    const result = await Market.updateMany(
      {},
      { $set: { open: '***', close: '***' } }
    );
    console.log(`[MANUAL] Reset ${result.modifiedCount} markets`);
    res.json({ 
      message: 'All markets reset successfully', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error resetting markets:', error);
    res.status(500).json({ error: 'Failed to reset markets' });
  }
});

// ========== LIVE RESULTS API ==========

// GET all live results
app.get('/api/live-results', async (req, res) => {
  try {
    const results = await LiveResult.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching live results:', error);
    res.status(500).json({ error: 'Failed to fetch live results' });
  }
});

// GET single live result by ID
app.get('/api/live-results/:id', async (req, res) => {
  try {
    const result = await LiveResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Live result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching live result:', error);
    res.status(500).json({ error: 'Failed to fetch live result' });
  }
});

// POST create new live result
app.post('/api/live-results', async (req, res) => {
  try {
    const { name, result, timeRange } = req.body;
    
    if (!name || !timeRange) {
      return res.status(400).json({ error: 'Name and timeRange are required' });
    }

    const newResult = new LiveResult({
      name: name.toUpperCase(),
      result: result || 'Loading...',
      timeRange
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error('Error creating live result:', error);
    res.status(500).json({ error: 'Failed to create live result' });
  }
});

// PUT update live result
app.put('/api/live-results/:id', async (req, res) => {
  try {
    const { name, result, timeRange, isActive } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name.toUpperCase();
    if (result !== undefined) updateData.result = result;
    if (timeRange) updateData.timeRange = timeRange;
    if (isActive !== undefined) updateData.isActive = isActive;

    const liveResult = await LiveResult.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!liveResult) {
      return res.status(404).json({ error: 'Live result not found' });
    }

    res.json(liveResult);
  } catch (error) {
    console.error('Error updating live result:', error);
    res.status(500).json({ error: 'Failed to update live result' });
  }
});

// DELETE live result
app.delete('/api/live-results/:id', async (req, res) => {
  try {
    const result = await LiveResult.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: 'Live result not found' });
    }

    res.json({ message: 'Live result deleted successfully' });
  } catch (error) {
    console.error('Error deleting live result:', error);
    res.status(500).json({ error: 'Failed to delete live result' });
  }
});

// ========== LUCKY NUMBER API (single site-wide) ==========
const LUCKY_GOLDEN_ANK_KEY = 'LUCKY_GOLDEN_ANK'
const LUCKY_MOTOR_PATTI_KEY = 'LUCKY_MOTOR_PATTI'

app.get('/api/lucky-number', async (req, res) => {
  try {
    const [goldenAnkSetting, motorPattiSetting] = await Promise.all([
      Setting.findOne({ key: LUCKY_GOLDEN_ANK_KEY }).lean(),
      Setting.findOne({ key: LUCKY_MOTOR_PATTI_KEY }).lean()
    ]);
    const toVal = (s) => {
      const v = (s && String(s).trim()) || '';
      return v === '-' ? '' : v;
    };
    res.json({
      goldenAnk: toVal(goldenAnkSetting?.value),
      motorPatti: toVal(motorPattiSetting?.value)
    });
  } catch (error) {
    console.error('Error fetching lucky number:', error);
    res.status(500).json({ error: 'Failed to fetch lucky number' });
  }
});

app.put('/api/lucky-number', async (req, res) => {
  try {
    const { goldenAnk, motorPatti } = req.body;
    const gaVal = (goldenAnk != null ? String(goldenAnk).trim() : '') || '-';
    const mpVal = (motorPatti != null ? String(motorPatti).trim() : '') || '-';
    await Promise.all([
      Setting.findOneAndUpdate(
        { key: LUCKY_GOLDEN_ANK_KEY },
        { $set: { value: gaVal, description: 'Today Lucky Number - Golden Ank' } },
        { upsert: true, new: true, runValidators: true }
      ),
      Setting.findOneAndUpdate(
        { key: LUCKY_MOTOR_PATTI_KEY },
        { $set: { value: mpVal, description: 'Today Lucky Number - Motor Patti' } },
        { upsert: true, new: true, runValidators: true }
      )
    ]);
    const [goldenAnkSetting, motorPattiSetting] = await Promise.all([
      Setting.findOne({ key: LUCKY_GOLDEN_ANK_KEY }).lean(),
      Setting.findOne({ key: LUCKY_MOTOR_PATTI_KEY }).lean()
    ]);
    const toVal = (s) => {
      const v = (s && String(s).trim()) || '';
      return v === '-' ? '' : v;
    };
    res.json({
      goldenAnk: toVal(goldenAnkSetting?.value),
      motorPatti: toVal(motorPattiSetting?.value)
    });
  } catch (error) {
    console.error('Error updating lucky number:', error);
    res.status(500).json({ error: 'Failed to update lucky number' });
  }
});

// ========== SETTINGS API ==========

// GET all settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find().sort({ key: 1 });
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// GET single setting by key
app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key.toUpperCase() });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// PUT update setting (creates if doesn't exist)
app.put('/api/settings/:key', async (req, res) => {
  try {
    const { value, description } = req.body;
    const key = req.params.key.toUpperCase();
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, description: description || '' },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(setting);
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// POST create new setting
app.post('/api/settings', async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    const newSetting = new Setting({
      key: key.toUpperCase(),
      value,
      description: description || ''
    });

    const savedSetting = await newSetting.save();
    res.status(201).json(savedSetting);
  } catch (error) {
    console.error('Error creating setting:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Setting with this key already exists' });
    }
    res.status(500).json({ error: 'Failed to create setting' });
  }
});

// ========== CHART DATA API ==========

// GET all chart data
app.get('/api/chart-data', async (req, res) => {
  try {
    const charts = await ChartData.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(charts);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// GET single chart by ID
app.get('/api/chart-data/:id', async (req, res) => {
  try {
    const chart = await ChartData.findById(req.params.id);
    if (!chart) {
      return res.status(404).json({ error: 'Chart data not found' });
    }
    res.json(chart);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// POST create new chart data
app.post('/api/chart-data', async (req, res) => {
  try {
    const { dateRange, mon, tue, wed, thu, fri, sat, sun } = req.body;
    
    if (!dateRange) {
      return res.status(400).json({ error: 'Date range is required' });
    }

    const newChart = new ChartData({
      dateRange,
      mon: mon || '',
      tue: tue || '',
      wed: wed || '',
      thu: thu || '',
      fri: fri || '',
      sat: sat || '',
      sun: sun || ''
    });

    const savedChart = await newChart.save();
    res.status(201).json(savedChart);
  } catch (error) {
    console.error('Error creating chart data:', error);
    res.status(500).json({ error: 'Failed to create chart data' });
  }
});

// PUT update chart data
app.put('/api/chart-data/:id', async (req, res) => {
  try {
    const { dateRange, mon, tue, wed, thu, fri, sat, sun, isActive } = req.body;
    const updateData = {};
    
    if (dateRange) updateData.dateRange = dateRange;
    if (mon !== undefined) updateData.mon = mon;
    if (tue !== undefined) updateData.tue = tue;
    if (wed !== undefined) updateData.wed = wed;
    if (thu !== undefined) updateData.thu = thu;
    if (fri !== undefined) updateData.fri = fri;
    if (sat !== undefined) updateData.sat = sat;
    if (sun !== undefined) updateData.sun = sun;
    if (isActive !== undefined) updateData.isActive = isActive;

    const chart = await ChartData.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!chart) {
      return res.status(404).json({ error: 'Chart data not found' });
    }

    res.json(chart);
  } catch (error) {
    console.error('Error updating chart data:', error);
    res.status(500).json({ error: 'Failed to update chart data' });
  }
});

// DELETE chart data
app.delete('/api/chart-data/:id', async (req, res) => {
  try {
    const chart = await ChartData.findByIdAndDelete(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ error: 'Chart data not found' });
    }

    res.json({ message: 'Chart data deleted successfully' });
  } catch (error) {
    console.error('Error deleting chart data:', error);
    res.status(500).json({ error: 'Failed to delete chart data' });
  }
});

// ========== NUMBER DATA API (from MongoDB numberData.history.numbers collection) ==========

// GET all number data documents
app.get('/api/number-data', async (req, res) => {
  try {
    // Access the numberData database
    const numberDataDb = mongoose.connection.useDb('numberData');
    const collection = numberDataDb.collection('numbers');
    
    // Get all documents, sorted by timestamp (newest first)
    const documents = await collection.find({}).sort({ timestamp: -1 }).toArray();
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching number data:', error);
    res.status(500).json({ error: 'Failed to fetch number data' });
  }
});

// GET single number data document by ID
app.get('/api/number-data/:id', async (req, res) => {
  try {
    const numberDataDb = mongoose.connection.useDb('numberData');
    const collection = numberDataDb.collection('numbers');
    const { ObjectId } = require('mongodb');
    
    const document = await collection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!document) {
      return res.status(404).json({ error: 'Number data not found' });
    }
    
    res.json(document);
  } catch (error) {
    console.error('Error fetching number data:', error);
    res.status(500).json({ error: 'Failed to fetch number data' });
  }
});

// GET all chart entries from all number data documents (flattened)
app.get('/api/number-data/charts/all', async (req, res) => {
  try {
    const numberDataDb = mongoose.connection.useDb('numberData');
    const collection = numberDataDb.collection('numbers');
    
    // Get all documents
    const documents = await collection.find({}).sort({ timestamp: -1 }).toArray();
    
    // Flatten all data arrays into a single array with source info
    const allCharts = [];
    documents.forEach(doc => {
      if (doc.data && Array.isArray(doc.data)) {
        doc.data.forEach((chartEntry, index) => {
          allCharts.push({
            ...chartEntry,
            source: doc.source,
            timestamp: doc.timestamp,
            documentId: doc._id,
            index: index
          });
        });
      }
    });
    
    res.json(allCharts);
  } catch (error) {
    console.error('Error fetching all chart entries:', error);
    res.status(500).json({ error: 'Failed to fetch chart entries' });
  }
});

// ========== HTML CHART DATA API ==========

// GET all HTML chart data
app.get('/api/html-chart-data', async (req, res) => {
  try {
    const { marketName } = req.query;
    const query = {};
    
    if (marketName) {
      query.marketName = marketName;
    }
    
    const charts = await HtmlChartData.find(query).sort({ order: 1, createdAt: -1 });
    res.json(charts);
  } catch (error) {
    console.error('Error fetching HTML chart data:', error);
    res.status(500).json({ error: 'Failed to fetch HTML chart data' });
  }
});

// GET single HTML chart entry by ID
app.get('/api/html-chart-data/:id', async (req, res) => {
  try {
    const chart = await HtmlChartData.findById(req.params.id);
    if (!chart) {
      return res.status(404).json({ error: 'Chart entry not found' });
    }
    res.json(chart);
  } catch (error) {
    console.error('Error fetching HTML chart entry:', error);
    res.status(500).json({ error: 'Failed to fetch HTML chart entry' });
  }
});

// POST create new HTML chart entry
app.post('/api/html-chart-data', async (req, res) => {
  try {
    const { Date, Mon, Tue, Wed, Thu, Fri, Sat, Sun, marketName, order } = req.body;
    
    if (!Date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const newChart = new HtmlChartData({
      Date: Date.trim(),
      Mon: Mon || null,
      Tue: Tue || null,
      Wed: Wed || null,
      Thu: Thu || null,
      Fri: Fri || null,
      Sat: Sat || null,
      Sun: Sun || null,
      marketName: marketName || 'Kalyan Market',
      order: order || 0
    });

    const savedChart = await newChart.save();
    res.status(201).json(savedChart);
  } catch (error) {
    console.error('Error creating HTML chart entry:', error);
    res.status(500).json({ error: 'Failed to create HTML chart entry' });
  }
});

// PUT update HTML chart entry
app.put('/api/html-chart-data/:id', async (req, res) => {
  try {
    const { Date, Mon, Tue, Wed, Thu, Fri, Sat, Sun, marketName, order } = req.body;
    const updateData = {};
    
    if (Date) updateData.Date = Date.trim();
    if (Mon !== undefined) updateData.Mon = Mon;
    if (Tue !== undefined) updateData.Tue = Tue;
    if (Wed !== undefined) updateData.Wed = Wed;
    if (Thu !== undefined) updateData.Thu = Thu;
    if (Fri !== undefined) updateData.Fri = Fri;
    if (Sat !== undefined) updateData.Sat = Sat;
    if (Sun !== undefined) updateData.Sun = Sun;
    if (marketName) updateData.marketName = marketName;
    if (order !== undefined) updateData.order = order;

    const chart = await HtmlChartData.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!chart) {
      return res.status(404).json({ error: 'Chart entry not found' });
    }

    res.json(chart);
  } catch (error) {
    console.error('Error updating HTML chart entry:', error);
    res.status(500).json({ error: 'Failed to update HTML chart entry' });
  }
});

// DELETE HTML chart entry
app.delete('/api/html-chart-data/:id', async (req, res) => {
  try {
    const chart = await HtmlChartData.findByIdAndDelete(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ error: 'Chart entry not found' });
    }

    res.json({ message: 'Chart entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting HTML chart entry:', error);
    res.status(500).json({ error: 'Failed to delete HTML chart entry' });
  }
});

// POST bulk import HTML chart data (for initial import from HTML file)
app.post('/api/html-chart-data/bulk', async (req, res) => {
  try {
    const { charts } = req.body;
    
    if (!Array.isArray(charts) || charts.length === 0) {
      return res.status(400).json({ error: 'Charts array is required' });
    }

    // Clear existing data if needed
    if (req.query.replace === 'true') {
      await HtmlChartData.deleteMany({});
    }

    const savedCharts = await HtmlChartData.insertMany(charts);
    res.status(201).json({ message: `Successfully imported ${savedCharts.length} chart entries`, count: savedCharts.length });
  } catch (error) {
    console.error('Error bulk importing HTML chart data:', error);
    res.status(500).json({ error: 'Failed to bulk import HTML chart data' });
  }
});

// ========== SEED JSON DATA TO DATABASE ==========

// Function to convert week_range and day to actual date
function getDateFromWeekRange(weekRange, day) {
  // weekRange format: "28-09-2020 to 04-10-2020"
  // day format: "Mon", "Tue", etc.
  const [startDateStr] = weekRange.split(' to ');
  const [dayNum, monthNum, yearNum] = startDateStr.split('-').map(Number);
  
  // Start from Monday of that week
  const monday = new Date(yearNum, monthNum - 1, dayNum);
  const dayOfWeek = monday.getDay();
  const diff = monday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
  monday.setDate(diff);
  
  // Map day name to offset from Monday
  const dayMap = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 };
  const offset = dayMap[day] || 0;
  
  const targetDate = new Date(monday);
  targetDate.setDate(targetDate.getDate() + offset);
  targetDate.setHours(0, 0, 0, 0);
  
  return targetDate;
}

// POST endpoint to seed JSON data into database
app.post('/api/daily-results/seed', async (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'daywise_open_close_result.json');
    const fileContent = await fs.readFile(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    let imported = 0;
    let updated = 0;
    let errors = 0;
    const errorDetails = [];
    
    for (const item of jsonData) {
      try {
        const weekRange = item.week_range || item.week;
        if (!weekRange || !item.day) {
          errors++;
          continue;
        }
        
        const date = getDateFromWeekRange(weekRange, item.day);
        const marketName = 'KALYAN'; // Default market name
        
        // Check if entry already exists
        const existing = await DailyResult.findOne({
          date: date,
          marketName: marketName
        });
        
        const resultData = {
          date: date,
          marketName: marketName,
          open: (item.open || '').trim(),
          close: (item.close || '').trim(),
          result: (item.result || '').trim()
        };
        
        if (existing) {
          // Update existing
          await DailyResult.findByIdAndUpdate(existing._id, resultData);
          updated++;
        } else {
          // Create new
          await DailyResult.create(resultData);
          imported++;
        }
      } catch (error) {
        console.error(`Error processing item:`, item, error.message);
        errors++;
        errorDetails.push({ item, error: error.message });
      }
    }
    
    res.json({
      message: 'Seeding completed',
      imported,
      updated,
      errors,
      total: jsonData.length,
      errorDetails: errorDetails.slice(0, 10) // First 10 errors
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ error: 'Failed to seed data', details: error.message });
  }
});

// ========== DAILY RESULTS API ==========

// GET all daily results
app.get('/api/daily-results', async (req, res) => {
  try {
    const { date, marketName } = req.query;
    const query = {};
    
    if (date) {
      // Parse date and set to start of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (marketName) {
      query.marketName = marketName.toUpperCase();
    }
    
    const results = await DailyResult.find(query).sort({ date: -1, marketName: 1 });
    res.json(results);
  } catch (error) {
    console.error('Error fetching daily results:', error);
    res.status(500).json({ error: 'Failed to fetch daily results' });
  }
});

// GET single daily result by ID
app.get('/api/daily-results/:id', async (req, res) => {
  try {
    const result = await DailyResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Daily result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching daily result:', error);
    res.status(500).json({ error: 'Failed to fetch daily result' });
  }
});

// POST create new daily result (close is optional for partial results)
app.post('/api/daily-results', async (req, res) => {
  try {
    const { date, marketName, open, close, result } = req.body;
    
    // Only date, marketName, and open are required (close is optional for open-only results)
    if (!date || !marketName || !open) {
      return res.status(400).json({ error: 'Date, marketName, and open are required' });
    }

    // Parse date and set to start of day
    const resultDate = new Date(date);
    resultDate.setHours(0, 0, 0, 0);

    const newResult = new DailyResult({
      date: resultDate,
      marketName: marketName.toUpperCase(),
      open: open.trim(),
      close: close ? close.trim() : '',
      result: result ? result.trim() : ''
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Result for this date and market already exists' });
    }
    console.error('Error creating daily result:', error);
    res.status(500).json({ error: 'Failed to create daily result' });
  }
});

// PUT update daily result
app.put('/api/daily-results/:id', async (req, res) => {
  try {
    const { date, marketName, open, close, result } = req.body;
    const updateData = {};
    
    if (date) {
      const resultDate = new Date(date);
      resultDate.setHours(0, 0, 0, 0);
      updateData.date = resultDate;
    }
    if (marketName) updateData.marketName = marketName.toUpperCase();
    if (open) updateData.open = open.trim();
    if (close) updateData.close = close.trim();
    if (result !== undefined) updateData.result = result.trim();

    const dailyResult = await DailyResult.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!dailyResult) {
      return res.status(404).json({ error: 'Daily result not found' });
    }

    res.json(dailyResult);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Result for this date and market already exists' });
    }
    console.error('Error updating daily result:', error);
    res.status(500).json({ error: 'Failed to update daily result' });
  }
});

// DELETE daily result
app.delete('/api/daily-results/:id', async (req, res) => {
  try {
    const result = await DailyResult.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ error: 'Daily result not found' });
    }

    res.json({ message: 'Daily result deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily result:', error);
    res.status(500).json({ error: 'Failed to delete daily result' });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api/markets`);
  console.log(`✓ Live Results API available at http://localhost:${PORT}/api/live-results`);
  console.log(`✓ Settings API available at http://localhost:${PORT}/api/settings`);
  console.log(`✓ Chart Data API available at http://localhost:${PORT}/api/chart-data`);
  console.log(`✓ Daily Results API available at http://localhost:${PORT}/api/daily-results`);
  console.log(`✓ HTML Chart Data API available at http://localhost:${PORT}/api/html-chart-data`);
  console.log(`✓ Number Data API available at http://localhost:${PORT}/api/number-data`);
});
