// imports
const express = require('express');
const mongoose = require('mongoose');

/* Application */
const app = express();
// load environment variables
require('dotenv').config();
// middleware
app.use(express.json())

// need to make files accessible
app.use('/uploads', express.static('uploads'));

// routes
const auth = require('./routes/auth');
app.use('/api/auth', auth);

const user = require('./routes/user');
app.use('/api/user', user);

const dept = require('./routes/dept');
app.use('/api/dept', dept);

const employee = require('./routes/employee');
app.use('/api/employee', employee);
// connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });


app.listen(3000, () => {
    console.log("Server running in port 3000")
})