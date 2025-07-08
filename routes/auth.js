/* Registration */
const express = require('express');
const router = express.Router();
const { User } = require('../models/model');

// require fs & path, bcrypt, jwt and multer
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const multer = require('multer');
// storage location
const uploads = multer({dest:'uploads/'});

// Logic for registration
router.post('/register', uploads.single('photo'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
        //Photo logic
        let photo = null;
        // Check if photo is provided
        if (req.file) {
            const ext = path.extname(req.file.originalname); // Get the file extension
            const newFileName = Date.now() + ext;// Generate a unique filename using current timestamp
            const newPath = path.join('uploads', newFileName); // Create the file path
            fs.renameSync(req.file.path, newPath); // Move the file to the uploads directory
            photo = newPath.replace(/\\/g, '/'); // Replace backslashes with forward slashes for consistency
        }
        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            photo
        });
        // Save the user to the database
        const newUser = await user.save();

        console.log( name, email, hashedPassword );
        res.status(201).json({ message: 'User registered successfully', value: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/* Login */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password. use bcrypt to compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        // Return user data and token
        res.status(200).json({
            message: 'Login successful',
            user, token});
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// export the router
module.exports = router;