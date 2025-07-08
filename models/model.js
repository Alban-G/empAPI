// require mongoose for DB
const mongoose = require('mongoose');
// define schema
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type:String,

    },
    email: {
        type:String,
        require:true,
        unique:true
    },
    dob: {
        type:Date,
        default:Date.now
    },
    password: {
        type:String,
        require:true
    },
    photo:String
})
const employeeSchema = new Schema ({
    userId: {
        type:Schema.Types.ObjectId, ref:"User",
        default:null,
    },
    firstName: {
        type:String
    },
    lastName: {
        type:String
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    departmentId: {
        type:Schema.Types.ObjectId, ref:'Department',
        required:true
    },
    jobTitle: {
        type:String
    },
    hireDate: {
        type:Date
    },
    salary: {
        type:Number
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    }
})

// Department Schema
const departmentSchema = new Schema ({
    name: {
        type:String,
        required:true,
        unique:true
    },
    description: {
        type:String
    },
    managerId: {
        type:Schema.Types.ObjectId, ref:'Employee',
        default:null
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model("User", userSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Department = mongoose.model("Department", departmentSchema);

// export the schema
module.exports = {User, Employee, Department};