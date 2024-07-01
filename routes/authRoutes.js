
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const jwtSecret = 'your_very_strong_secret_key'; 

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        console.log('User registered successfully:', savedUser);
        res.json(savedUser);
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
   

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email }, 
            jwtSecret
        );
          
        
        res.header('auth-token', token).json({ token });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
