import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const API = "http://localhost:5000/api/registrations";
const PARTICIPANTS_API = "http://localhost:5000/api/participants";
const EVENTS_API = "http://localhost:5000/api/events";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ participant_id: "", event_id: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, pRes, eRes] = await Promise.all([
        axios.get(API),
        axios.get(PARTICIPANTS_API),
        axios.get(EVENTS_API),
      ]);
      setRegistrations(rRes.data);
      setParticipants(pRes.data);
      setEvents(eRes.data);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this registration?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Registration removed");
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.participant_id || !form.event_id) {
      showToast("Please select both participant and event", "error");
      return;
    }
    setSaving(true);
    try {
      await axios.post(API, form);
      showToast("Registration added");
      setShowModal(false);
      setForm({ participant_id: "", event_id: "" });
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = registrations.filter(
    (r) =>
      r.participant_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.event_name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <div>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registrations Management</h2>
          <p className="text-slate-500 text-sm mt-1">{registrations.length} total registrations</p>
        </div>
        <button
          onClick={() => { setForm({ participant_id: "", event_id: "" }); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-all"
        >
          + New Registration
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by participant or event name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading registrations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-left">
                  <th className="px-5 py-4 font-semibold w-12">ID</th>
                  <th className="px-5 py-4 font-semibold">Participant</th>
                  <th className="px-5 py-4 font-semibold">Event</th>
                  <th className="px-5 py-4 font-semibold">Registered At</th>
                  <th className="px-5 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">No registrations found</td>
                  </tr>
                ) : (
                  filtered.map((r, idx) => (
                    <tr key={r.registration_id} className={`border-t border-slate-100 hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{r.registration_id}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {r.participant_name?.[0]?.toUpperCase() || "?"}
                          </span>
                          <span className="font-semibold text-slate-800">{r.participant_name}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                          {r.event_name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(r.registered_at)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleDelete(r.registration_id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="New Registration" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Participant *</label>
              <select required value={form.participant_id}
                onChange={(e) => setForm({ ...form, participant_id: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="">— Select Participant —</option>
                {participants.map((p) => (
                  <option key={p.participant_id} value={p.participant_id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Event *</label>
              <select required value={form.event_id}
                onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                <option value="">— Select Event —</option>
                {events.map((e) => (
                  <option key={e.event_id} value={e.event_id}>
                    {e.name} ({new Date(e.date).toLocaleDateString("en-IN")})
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-700">
              ℹ️ This will register the selected participant for the selected event.
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                {saving ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
