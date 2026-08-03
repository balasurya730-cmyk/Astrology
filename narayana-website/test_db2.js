require('dotenv').config();
const mongoose = require('mongoose');

async function test() {
  console.log('Testing SRV...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('SRV SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('SRV FAILED:', err.message);
  }

  console.log('Testing Direct...');
  try {
    const directUri = process.env.MONGODB_URI;
    await mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 });
    console.log('DIRECT SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('DIRECT FAILED:', err.message);
    process.exit(1);
  }
}

test();
