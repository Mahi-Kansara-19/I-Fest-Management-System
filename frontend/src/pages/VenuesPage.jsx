import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const API = "http://localhost:5000/api/venues";
const EMPTY = { venue_name: "", capacity: "", location: "" };

export default function VenuesPage() {
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
      const res = await axios.get(API);
      setVenues(res.data);
    } catch {
      showToast("Failed to load venues", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (v) => {
    setEditItem(v);
    setForm({ venue_name: v.venue_name, capacity: v.capacity, location: v.location || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Venue deleted");
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
        await axios.put(`${API}/${editItem.venue_id}`, form);
        showToast("Venue updated");
      } else {
        await axios.post(API, form);
        showToast("Venue added");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = venues.filter(
    (v) =>
      v.venue_name?.toLowerCase().includes(search.toLowerCase()) ||
      (v.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Venues Management</h2>
          <p className="text-slate-500 text-sm mt-1">{venues.length} venues registered</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-all"
        >
          + Add Venue
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading venues...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-left">
                  <th className="px-5 py-4 font-semibold w-12">ID</th>
                  <th className="px-5 py-4 font-semibold">Venue Name</th>
                  <th className="px-5 py-4 font-semibold">Location</th>
                  <th className="px-5 py-4 font-semibold">Capacity</th>
                  <th className="px-5 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">No venues found</td>
                  </tr>
                ) : (
                  filtered.map((v, idx) => (
                    <tr key={v.venue_id} className={`border-t border-slate-100 hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{v.venue_id}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{v.venue_name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{v.location || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {v.capacity} seats
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openEdit(v)} className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">Edit</button>
                          <button onClick={() => handleDelete(v.venue_id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">Delete</button>
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

      {showModal && (
        <Modal title={editItem ? "Edit Venue" : "Add New Venue"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Venue Name *</label>
              <input required type="text" value={form.venue_name}
                onChange={(e) => setForm({ ...form, venue_name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Main Auditorium" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
              <input type="text" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Block A, Ground Floor" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Capacity *</label>
              <input required type="number" value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. 500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                {saving ? "Saving..." : editItem ? "Update Venue" : "Add Venue"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
