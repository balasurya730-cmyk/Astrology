require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// API Routes mapped to the functions in the api folder
app.all('/api/auth', require('./api/auth.js'));
app.all('/api/contact', require('./api/contact.js'));
app.all('/api/appointments', require('./api/appointments.js'));
app.all('/api/testimonials', require('./api/testimonials.js'));

// Catch-all route to serve the main HTML file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
