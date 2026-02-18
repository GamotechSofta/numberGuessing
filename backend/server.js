require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Market = require('./models/Market');
const LiveResult = require('./models/LiveResult');
const Setting = require('./models/Setting');
const ChartData = require('./models/ChartData');

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
      { key: 'SITE_NAME', value: 'Dpboss Online', description: 'Website name' },
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
    const markets = await Market.find().sort({ createdAt: -1 });
    res.json(markets);
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
    const { name, open, close } = req.body;
    
    if (!name || !open || !close) {
      return res.status(400).json({ error: 'Name, open, and close are required' });
    }

    const newMarket = new Market({
      name: name.toUpperCase(),
      open,
      close
    });

    const savedMarket = await newMarket.save();
    res.status(201).json(savedMarket);
  } catch (error) {
    console.error('Error creating market:', error);
    res.status(500).json({ error: 'Failed to create market' });
  }
});

// PUT update market
app.put('/api/markets/:id', async (req, res) => {
  try {
    const { name, open, close } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name.toUpperCase();
    if (open) updateData.open = open;
    if (close) updateData.close = close;

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

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api/markets`);
  console.log(`✓ Live Results API available at http://localhost:${PORT}/api/live-results`);
  console.log(`✓ Settings API available at http://localhost:${PORT}/api/settings`);
  console.log(`✓ Chart Data API available at http://localhost:${PORT}/api/chart-data`);
  console.log(`✓ Number Data API available at http://localhost:${PORT}/api/number-data`);
});
