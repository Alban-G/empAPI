const express = require('express');
const router = express.Router();
const { User } = require('../models/model');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/auth');

// view all users
router.get('/',authenticate, async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// get single user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// update user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if user exists
        const user = await User.findById(req.params.id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
        // prepare data for update
        let updateData = { name, email };
        if (password) {
            // Hash the password if provided
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true});
        res.status(201).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});

// delete user
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

// export the router
module.exports = router;