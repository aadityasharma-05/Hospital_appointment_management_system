import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
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

  password: {
    type: String,
    minLength: [11, "Password must contain at least 11 characters!"],
    required: true,
    select: false,
  },

  role: {
    type: String,
    required: true,
    enum: ["Admin", "Doctor" , "patient"],
  },

  doctorDepartment: {
    url: { type: String },
  },

  docAvatar: {
    public_id: { type: String },
    url: { type: String },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", UserSchema);
