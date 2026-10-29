const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables from config/.env.
dotenv.config({
  path: path.join(__dirname, 'config', '.env'),
});

// Import the Student model.
const Student = require('./models/Student');

// Create the Express application.
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Allow the React frontend to communicate with the backend.
app.use(cors());

// Allow the server to read JSON request bodies.
app.use(express.json());

// GET: Retrieve all students.
app.get('/api/students', async (req, res) => {
  try {
    // Fetch all student records from MongoDB.
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new student.
app.post('/api/students', async (req, res) => {
  try {
    // Create a student from the submitted JSON data.
    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    // Return a conflict status for duplicate email addresses.
    const status = error.code === 11000 ? 409 : 400;

    res.status(status).json({ message: error.message });
  }
});

// PUT: Update an existing student by ID.
app.put('/api/students/:id', async (req, res) => {
  try {
    // Find the student and return the updated record.
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove a student by ID.
app.delete('/api/students/:id', async (req, res) => {
  try {
    // Find and delete the student record.
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      student,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Serve the React application for frontend routes.
app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB before starting the server.
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Atlas connected successfully');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

// Start the application.
startServer();