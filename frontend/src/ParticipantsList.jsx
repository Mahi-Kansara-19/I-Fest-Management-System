import { useState, useEffect } from "react";
import axios from "axios";

function ParticipantsList() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/participants")
      .then((response) => {
        setParticipants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching participants:", error);
      });
  }, []);

  return (
    <div style={{ marginTop: "40px", fontFamily: "Arial" }}>
      <h2>Registered Participants</h2>
      {participants.length > 0 ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Event ID</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.participant_id}>
                <td>{p.participant_id}</td>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.event_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No participants registered yet.</p>
      )}
    </div>
  );
}

export default ParticipantsList;
