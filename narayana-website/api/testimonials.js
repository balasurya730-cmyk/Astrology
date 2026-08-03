const mongoose = require('mongoose');
const connectDB = require('./_db');
const jwt = require('jsonwebtoken');

const TestimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  authorCity: { type: String, required: true },
  authorAvatar: { type: String, required: true }, // e.g. "P"
  text: { type: String, required: true },
  stars: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      const testimonial = new Testimonial(req.body);
      await testimonial.save();
      return res.status(201).json({ success: true, message: 'Testimonial added successfully!' });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }
      return res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
