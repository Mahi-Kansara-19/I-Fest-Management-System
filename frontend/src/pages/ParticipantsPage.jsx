import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../components/Modal";

const API = "http://localhost:5000/api/participants";
const EMPTY = { name: "", email: "", phone: "", college: "" };

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
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
      setParticipants(res.data);
    } catch {
      showToast("Failed to load participants", "error");
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
  const openEdit = (p) => {
    setEditItem(p);
    setForm({ name: p.name, email: p.email, phone: p.phone || "", college: p.college || "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this participant?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Participant deleted");
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
        await axios.put(`${API}/${editItem.participant_id}`, form);
        showToast("Participant updated");
      } else {
        await axios.post(API, form);
        showToast("Participant added");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || "Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const filtered = participants.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      (p.college || "").toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const COLORS = ["bg-indigo-500", "bg-rose-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-cyan-500"];

  return (
    <div>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Participants Management</h2>
          <p className="text-slate-500 text-sm mt-1">{participants.length} participants registered</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-all"
        >
          + Add Participant
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name, email, or college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading participants...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-left">
                  <th className="px-5 py-4 font-semibold w-12">ID</th>
                  <th className="px-5 py-4 font-semibold">Participant</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">College</th>
                  <th className="px-5 py-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">No participants found</td>
                  </tr>
                ) : (
                  filtered.map((p, idx) => (
                    <tr key={p.participant_id} className={`border-t border-slate-100 hover:bg-indigo-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{p.participant_id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${COLORS[idx % COLORS.length]}`}>
                            {getInitials(p.name)}
                          </div>
                          <span className="font-semibold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{p.email}</td>
                      <td className="px-5 py-3.5 text-slate-600">{p.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-600">{p.college || "—"}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => openEdit(p)} className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">Edit</button>
                          <button onClick={() => handleDelete(p.participant_id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition">Delete</button>
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
        <Modal title={editItem ? "Edit Participant" : "Add New Participant"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
              <input required type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. Diya Shah" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
              <input required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. diya@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
              <input type="text" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. 9812345678" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">College</label>
              <input type="text" value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="e.g. IIT Bombay" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                {saving ? "Saving..." : editItem ? "Update" : "Add Participant"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
