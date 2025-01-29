const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const db = require('../config/database'); 

const bcrypt = require('bcrypt'); 


const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Admin olma kontrolü
  if (role === 'Admin' && req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can create users with admin role.' });
  }

  try {
    // Önce, kullanıcı adının (username) veritabanında zaten mevcut olup olmadığını kontrol et
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Yeni kullanıcıyı oluştur
    const newUser = await userModel.createUser(username, password, role);
    await userModel.createRoleRelatedData(newUser.userid, role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userID: newUser.userid,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const userQuery = 'SELECT * FROM "User" WHERE Username = $1';
    const { rows } = await db.query(userQuery, [username]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userID: user.userid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
};
