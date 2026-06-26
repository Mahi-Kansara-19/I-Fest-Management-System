import { useEffect, useState } from "react";
import axios from "axios";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Event List</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-blue-200 text-gray-800">
          <tr>
            <th className="p-3 border border-gray-300">ID</th>
            <th className="p-3 border border-gray-300">Name</th>
            <th className="p-3 border border-gray-300">Date</th>
            <th className="p-3 border border-gray-300">Venue</th>
            <th className="p-3 border border-gray-300">Capacity</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.event_id} className="hover:bg-blue-50">
              <td className="p-3 border border-gray-300">{event.event_id}</td>
              <td className="p-3 border border-gray-300">{event.name}</td>
              <td className="p-3 border border-gray-300">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="p-3 border border-gray-300">{event.venue_name}</td>
              <td className="p-3 border border-gray-300">{event.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
