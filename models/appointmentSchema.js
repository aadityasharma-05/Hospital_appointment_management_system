import mongoose from "mongoose" ;
import validator from "validator"


const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name should be at least 3 characters!"],
  },

  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name should be at least 3 characters!"],
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a correct email"],
  },

  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number should be at least 10 digits!"],
  },

  Aadhareno: {
    type: String,
    required: true,
    minLength: [12, "Aadhar should contain at least 20 characters!"],
  },

  dob: {
    type: Date,
    required: [true, "DOB is required"],
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
    appointmentDate : {
        type : String ,
        required : true ,
    },
   
    doctor : {
        firstname :{
             type : String ,
             required : true ,
        },
          lastname :{
             type : String ,
             required : true ,
        }
    }, 

    hasVisited : {
        
             type : Boolean ,
             required : true ,
        
    }

});
