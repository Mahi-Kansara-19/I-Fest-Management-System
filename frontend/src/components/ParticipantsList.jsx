import { useEffect, useState } from "react";
import axios from "axios";

export default function ParticipantsList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/participants")
      .then((res) => {
        setParticipants(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching participants:", err));
  }, []);

  if (loading) return <p>Loading participants...</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Participants List</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-200 text-gray-800">
          <tr>
            <th className="p-3 border border-gray-300">ID</th>
            <th className="p-3 border border-gray-300">Name</th>
            <th className="p-3 border border-gray-300">Email</th>
            <th className="p-3 border border-gray-300">Event ID</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.participant_id} className="hover:bg-green-50">
              <td className="p-3 border border-gray-300">{p.participant_id}</td>
              <td className="p-3 border border-gray-300">{p.name}</td>
              <td className="p-3 border border-gray-300">{p.email}</td>
              <td className="p-3 border border-gray-300">{p.event_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
