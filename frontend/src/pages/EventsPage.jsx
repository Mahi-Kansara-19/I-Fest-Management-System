import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const API = "http://localhost:5000/api/events";
const VENUES_API = "http://localhost:5000/api/venues";

const EMPTY = { name: "", date: "", category: "", venue_id: "" };

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [evRes, vRes] = await Promise.all([
        axios.get(API),
        axios.get(VENUES_API),
      ]);
      setEvents(evRes.data);
      setVenues(vRes.data);
    } catch (e) {
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

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY);
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setEditItem(ev);
    setForm({
      name: ev.name,
      date: ev.date?.split("T")[0] || "",
      category: ev.category || "",
      venue_id: ev.venue_id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Event deleted");
      fetchAll();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await axios.put(`${API}/${editItem.event_id}`, form);
        showToast("Event updated");
      } else {
        await axios.post(API, form);
        showToast("Event added");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = events.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.venue_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Events Management</h2>
          <p className="text-slate-500 text-sm mt-1">
            {events.length} total events in the system
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-all flex items-center gap-2"
        >
          + Add Event
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, category or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading events...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-left">
                  <th className="px-5 py-4 font-semibold w-12">ID</th>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Venue</th>
                  <th className="px-5 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      No events found
                    </td>
                  </tr>
                ) : (
                  filtered.map((ev, idx) => (
                    <tr
                      key={ev.event_id}
                      className={`border-t border-slate-100 hover:bg-indigo-50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{ev.event_id}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{ev.name}</td>
                      <td className="px-5 py-3.5">
                        {ev.category ? (
                          <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {ev.category}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {ev.date ? new Date(ev.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{ev.venue_name || "—"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openEdit(ev)}
                            className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ev.event_id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editItem ? "Edit Event" : "Add New Event"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Event Name *</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Tech Quiz"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Technical, Cultural"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Venue</label>
              <select
                value={form.venue_id}
                onChange={(e) => setForm({ ...form, venue_id: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">— Select Venue —</option>
                {venues.map((v) => (
                  <option key={v.venue_id} value={v.venue_id}>
                    {v.venue_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60"
              >
                {saving ? "Saving..." : editItem ? "Update Event" : "Add Event"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
