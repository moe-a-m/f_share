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
            return res.status(401).json({ message: 'Invalid credentials for ' + username });
        }

        // Create a JWT token
        const claims = { id: user._id, username: user.username };
        const jwtToken = nJwt.create(claims, signingKey);
        jwtToken.setExpiration(new Date().getTime() + 60 * 60 * 1000); // 1 hour expiry
        const token = jwtToken.compact();

        // Prepare user data to send to frontend
        const userProfile = {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles, // Ensure 'roles' is a field in your User model
            accessToken: token,
            tokenType: 'Bearer' // Include if you use Bearer tokens
        };

        res.json(userProfile);
    } catch (error) {
        res.status(400).json({ error: 'Error logging in: ' + error.message });
    }
});

module.exports = router;
