const mongoose = require('mongoose');

// Define the structure of a student record.
const studentSchema = new mongoose.Schema(
  {
    // Student's full name.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Student's email address.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Student's course of study.
    course: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    // Automatically record creation and update dates.
    timestamps: true,
  }
);

// Export the model so the server can use it.
module.exports = mongoose.model('Student', studentSchema);