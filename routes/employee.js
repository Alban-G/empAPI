// reqire imports
const express = require('express');
const router = express.Router();
const { Department, Employee, User } = require('../models/model');
const authenticate = require('../middleware/auth');

// register a new employee
router.post('/', authenticate, async (req, res) => {
    try {
        const { firstName, lastName, email, departmentId, hireDate, salary, jobTitle } = req.body;
        // Check if the department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json({ message: 'Department not found' });
        };
        // Check if the email is already registered
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already registered' });
        };
        // Create a new employee
        const employee = new Employee({
            firstName,
            lastName,
            email,
            departmentId,
            hireDate: new Date(hireDate),
            salary,
            jobTitle,
            userId:req.user.id
        });
        const newEmployee = await employee.save();
        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
});

// get all employees
router.get('/', authenticate, async (req, res) => {
    try {
        const employees = await Employee.find().populate('departmentId', 'name').populate('userId', 'name email');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});

// get a single employee by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('departmentId', 'name').populate('userId', 'name email');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
});

// update an employee
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { firstName, lastName, email, departmentId, salary, jobTitle } = req.body;
        // Check if the department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json({ message: 'Department not found' });
        };
        // If the email is changed, check if it already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) { 
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Update the employee
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, departmentId, salary, jobTitle, updatedAt: Date.now(), userId: req.user.id },
            { new: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const registree = await User.findById(req.user.id).select('name');
        const registeredBy = registree ? registree.name : 'Unknown';
        
        res.status(200).json({ message: `Employee updated successfully by ${registeredBy}`, employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

// delete an employee
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
});

// export
module.exports = router;