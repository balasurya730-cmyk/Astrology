const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // In a real scenario, you'd fetch the admin from DB. 
    // Here we're using ENV vars for simple single-admin setup.
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      console.error('Admin credentials are not set in environment variables.');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // Simple string comparison for the demo. In production, consider bcrypt comparison
    if (username === adminUser && password === adminPass) {
      const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
