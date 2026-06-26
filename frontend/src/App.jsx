import { useState } from "react";
import EventsPage from "./pages/EventsPage";
import VenuesPage from "./pages/VenuesPage";
import ParticipantsPage from "./pages/ParticipantsPage";
import RegistrationsPage from "./pages/RegistrationsPage";

const TABS = [
  { id: "Events", label: "🎭 Events" },
  { id: "Venues", label: "🏟️ Venues" },
  { id: "Participants", label: "👥 Participants" },
  { id: "Registrations", label: "📋 Registrations" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Events");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎪</span>
              <div>
                <h1 className="text-2xl font-bold text-indigo-900 tracking-tight">
                  I-Fest Management
                </h1>
                <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">
                  Admin Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                ● Live
              </span>
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                A
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "text-slate-500 border-transparent hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "Events" && <EventsPage />}
        {activeTab === "Venues" && <VenuesPage />}
        {activeTab === "Participants" && <ParticipantsPage />}
        {activeTab === "Registrations" && <RegistrationsPage />}
      </main>
    </div>
  );
}
