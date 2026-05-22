import React, { useState } from "react";
import { TrackDay } from "../types";
import { 
  CheckSquare, 
  Trash2, 
  Plus, 
  MapPin, 
  Calendar, 
  PhoneCall, 
  Clock, 
  UserCheck, 
  FileText,
  Video,
  Activity,
  Droplet
} from "lucide-react";

interface DailyTrackerProps {
  logs: TrackDay[];
  onAddLog: (log: TrackDay) => void;
  language: "en" | "ur";
}

export default function DailyTracker({ logs, onAddLog, language }: DailyTrackerProps) {
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [checkedAM, setCheckedAM] = useState<boolean>(false);
  const [checkedPM, setCheckedPM] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<"tracker" | "booking">("tracker");

  // Booking states
  const [selectedDoc, setSelectedDoc] = useState<string>("Dr. Aisha Kamal");
  const [selectedTime, setSelectedTime] = useState<string>("04:30 PM");
  const [consultType, setConsultType] = useState<string>("Video Consultation");
  const [bookings, setBookings] = useState<any[]>([
    { id: 1, docName: "Dr. Bilal Siddiqui", date: "2026-05-24", slot: "11:00 AM", type: "Video Consultation", status: "Confirmed" }
  ]);

  const recordDailyWellness = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Evaluate automated skin score based on sleep & water limits
    let score = 60 + Math.min(20, (sleepHours * 2.5)) + Math.min(20, (waterGlasses * 2));
    if (checkedAM && checkedPM) score += 10; // extra routines bonus

    const newTrack: TrackDay = {
      date: new Date().toISOString().split("T")[0],
      score: Math.min(100, score),
      waterIntake: waterGlasses,
      sleepHours: sleepHours,
      notes: notes || "Feeling radiant.",
      checkedMorningRoutine: checkedAM,
      checkedNightRoutine: checkedPM
    };

    onAddLog(newTrack);
    setNotes("");
    alert("Daily skin wellness tracked successfully! Metrics stored.");
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      docName: selectedDoc,
      date: "2026-05-25",
      slot: selectedTime,
      type: consultType,
      status: "Pending Details Verification"
    };

    setBookings((prev) => [newBook, ...prev]);
    alert(`Success! Consultation booked with ${selectedDoc}. Meeting ID dispathed inside secure channel.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans">
      
      {/* Tab bar header */}
      <div className="flex bg-slate-950 p-1 border-b border-slate-850">
        <button
          onClick={() => setActiveSubTab("tracker")}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "tracker" ? "bg-slate-850 text-sky-400 shadow-sm" : "text-slate-500 hover:text-slate-400"
          }`}
          id="subtab-wellness"
        >
          <Activity className="w-3.5 h-3.5" />
          Skin Wellness Tracker
        </button>
        <button
          onClick={() => setActiveSubTab("booking")}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "booking" ? "bg-slate-850 text-sky-400 shadow-sm" : "text-slate-500 hover:text-slate-400"
          }`}
          id="subtab-booking"
        >
          <MapPin className="w-3.5 h-3.5" />
          Doctor Consultation
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4">
        
        {activeSubTab === "tracker" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Record log form */}
            <form onSubmit={recordDailyWellness} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
              <h3 className="text-xs font-extrabold text-white pb-1.5 border-b border-slate-900 flex items-center justify-between">
                <span>Record Skin Metrics</span>
                <span className="text-[9px] text-slate-500">{new Date().toDateString()}</span>
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Water meter */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-sky-400" />
                    Hydration (Glasses)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={waterGlasses}
                    onChange={(e) => setWaterGlasses(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-white text-center focus:outline-none"
                    id="track-water"
                  />
                </div>

                {/* Sleep meter */}
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Sleep Sleep (Hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-white text-center focus:outline-none"
                    id="track-sleep"
                  />
                </div>
              </div>

              {/* Routine checkmarks */}
              <div className="space-y-2 pt-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Regime Composure</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs hover:bg-slate-850">
                    <input 
                      type="checkbox" 
                      checked={checkedAM} 
                      onChange={() => setCheckedAM(!checkedAM)}
                      className="rounded accent-sky-400 w-3.5 h-3.5"
                    />
                    <span className="text-slate-300 font-sans">Morning Skincare</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs hover:bg-slate-850">
                    <input 
                      type="checkbox" 
                      checked={checkedPM} 
                      onChange={() => setCheckedPM(!checkedPM)}
                      className="rounded accent-indigo-400 w-3.5 h-3.5"
                    />
                    <span className="text-slate-300">Night Skincare</span>
                  </label>
                </div>
              </div>

              {/* Daily notes */}
              <div className="space-y-1">
                <label className="block text-[9px] font-bold uppercase text-slate-400">Biological Observation Details</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Skin feels dry due to high sun exposure outdoors..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-sans"
                  id="track-notes"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-450 transition-colors text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5"
                id="btn-submit-track"
              >
                <Plus className="w-4 h-4 text-black" />
                Commit Biological Log
              </button>
            </form>

            {/* Logs timeline */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Recent Wellness History</h4>
              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic bg-slate-950/20 border border-slate-850 rounded-xl">
                  No tracking data recorded for current calendar block.
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto no-scrollbar">
                  {logs.map((log, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-850/60 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-slate-350">
                          <span>{log.date}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            log.score >= 80 ? "bg-emerald-950 text-emerald-400" : "bg-sky-950 text-sky-400"
                          }`}>
                            Score: {log.score}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">"{log.notes}"</p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span>💧 {log.waterIntake}gl</span>
                        <span>🛌 {log.sleepHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Doctor clinical appointments booking tab */}
        {activeSubTab === "booking" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Book form */}
            <form onSubmit={handleCreateBooking} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3.5">
              <h3 className="text-xs font-extrabold text-white pb-1.5 border-b border-slate-900 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-sky-400" />
                Book Virtual Skincare Dermatologist
              </h3>

              <div className="space-y-2">
                <div>
                  <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Select Specialist
                  </label>
                  <select
                    value={selectedDoc}
                    onChange={(e) => setSelectedDoc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                    id="booking-doc-select"
                  >
                    <option value="Dr. Aisha Kamal (Acne consultant)">Dr. Aisha Kamal (Acne consultant)</option>
                    <option value="Dr. Bilal Siddiqui (Eczema Senior)">Dr. Bilal Siddiqui (Eczema Senior)</option>
                    <option value="Dr. Maryam Jamil (Cosmetics specialist)">Dr. Maryam Jamil (Cosmetics specialist)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="09:00 AM">09:00 AM GMT</option>
                      <option value="11:30 AM">11:30 AM GMT</option>
                      <option value="04:30 PM">04:30 PM PKT</option>
                      <option value="06:00 PM">06:00 PM PKT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Channel Type
                    </label>
                    <select
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Video Consultation">Video Consultation</option>
                      <option value="Secure Text Chat">Secure Text Chat</option>
                      <option value="Physical Visit">In-clinic Standard</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-450 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                id="btn-submit-booking"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                Schedule Live Appointment
              </button>
            </form>

            {/* List bookings */}
            <div className="space-y-3">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Appointment Queues</span>
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-950 border border-slate-850/60 rounded-xl flex items-start justify-between text-xs font-sans">
                    <div>
                      <h4 className="font-bold text-slate-200">{b.docName}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>📅 {b.date}</span>
                        <span>•</span>
                        <span>⏰ {b.slot}</span>
                      </p>
                      <span className="inline-block mt-1 text-[9px] text-sky-400 bg-sky-950/40 border border-sky-900/40 px-1.5 py-0.2 rounded font-mono">
                        {b.type}
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-teal-400 font-bold uppercase tracking-wide">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
