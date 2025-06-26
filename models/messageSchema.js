import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name should be at least 3 characters!"]
  },

  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name should be at least 3 characters!"]
  },

  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a correct email"]
  },

  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number should be at least 10 digits!"]
  },

  message: {
    type: String,
    required: true,
    minLength: [10, "Message should be at least 10 characters!"]
  }
});

export const Message = mongoose.model("Message", messageSchema);
