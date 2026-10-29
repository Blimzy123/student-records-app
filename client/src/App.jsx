import { useEffect, useState } from 'react';
import './App.css';

// Address of our Express backend.
const API_URL = '/api/students';

function App() {
  // Store the students retrieved from the database.
  const [students, setStudents] = useState([]);

  // Store the values entered in the form.
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
  });

  // Store loading and feedback messages.
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Retrieve students when the page first loads.
  async function fetchStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Could not retrieve students');
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update the form when a user types.
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  // Submit a new student to the backend.
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not add student');
      }

      setMessage('Student added successfully!');
      setForm({ name: '', email: '', course: '' });

      // Refresh the student list after saving.
      await fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">STUDENT MANAGEMENT</p>
        <h1>Student Records</h1>
        <p>Manage student information in one place.</p>
      </header>

      <section className="panel">
        <h2>Add a student</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter student's name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
          />

          <label htmlFor="course">Course of study</label>
          <input
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            required
          />

          <button type="submit">Add student</button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <h2>Registered students</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <article className="student-card" key={student._id}>
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <span>{student.course}</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer>
        Student Records App · Built with React, Express and MongoDB
      </footer>
    </main>
  );
}

export default App;
