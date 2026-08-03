const mongoose = require('mongoose');
const connectDB = require('./_db');
const jwt = require('jsonwebtoken');

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  service: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === 'POST') {
    try {
      const appointment = new Appointment(req.body);
      await appointment.save();
      return res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    // Check Auth
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
