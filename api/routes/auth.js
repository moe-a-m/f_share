const express = require('express');
const User = require('../models/user');
const router = express.Router();
const nJwt = require('njwt');
const secureRandom = require('secure-random');



// Create a signing key (you can store this in the `.env` file for safety)
const signingKey = process.env.JWT_SECRET || secureRandom(256, { type: 'Buffer' });

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    try {
        const user = new User({ username, email, password });

        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' + username});
        }

        // Create a JWT token
        const claims = { id: user._id, username: user.username };
        const jwt = nJwt.create(claims, signingKey);
        jwt.setExpiration(new Date().getTime() + 60 * 60 * 1000); // 1 hour expiry
        const token = jwt.compact();

        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Error logging in' + error.message });
    }
});

module.exports = router;
