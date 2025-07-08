// reqire imports
const express = require('express');
const router = express.Router();
const { Department, Employee } = require('../models/model');
const authenticate = require('../middleware/auth');


// Create a new department
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = new Department({ name, description });
        const newDepartment = await department.save();
        res.status(201).json({ message: 'Department created successfully', department: newDepartment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating department', error: error.message });
    }
});

// Get all departments
router.get('/', authenticate, async (req, res) => {
    try {
        const departments = await Department.find().populate('managerId', 'firstName lastName');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
});

// Get a single department by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('managerId', 'firstName lastName');
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching department', error: error.message });
    }
});

// Update a department
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, description, managerId } = req.body;
        // Check if the manager exists
        const manager = await Employee.findById(managerId);
        if (!manager) {
            return res.status(400).json({ message: 'Manager not found' });
        };
        // Update the department
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, description, managerId, updatedAt: Date.now() },
            { new: true }
        );
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department updated successfully', department });
    } catch (error) {
        res.status(500).json({ message: 'Error updating department', error: error.message });
    }
});

// Delete a department
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting department', error: error.message });
    }
});

module.exports = router;