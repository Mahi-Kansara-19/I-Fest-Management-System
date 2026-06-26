import { useState, useEffect } from "react";
import axios from "axios";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch events for dropdown
  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/participants", {
      name,
      email,
      event_id: eventId
    })
      .then(() => {
        setMessage("✅ Registration successful!");
        setName("");
        setEmail("");
        setEventId("");
      })
      .catch(() => setMessage("❌ Error registering. Try again."));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Participant Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Select Event: </label>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} required>
            <option value="">--Choose--</option>
            {events.map((event) => (
              <option key={event.event_id} value={event.event_id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterForm;

