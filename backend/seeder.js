const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import model
const Weather = require('./models/Weather');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Read JSON data
const importData = async () => {
  try {
    // Path to the JSON file
    const jsonPath = path.join(__dirname, '..', 'Data', 'clean_output.json');
    
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    console.log(`Found ${data.length} weather records to import`);
    
    // Delete existing data
    await Weather.deleteMany({});
    console.log('Deleted existing weather data');
    
    // Import new data
    await Weather.insertMany(data);
    console.log('Weather data imported successfully');
    
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

// Execute import
importData(); 