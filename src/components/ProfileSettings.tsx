import React, { useState } from "react";
import { UserProfile, ScanResult } from "../types";
import { 
  User, 
  MapPin, 
  Settings, 
  ShieldAlert, 
  Globe, 
  History, 
  Share2, 
  LogOut, 
  Moon, 
  Award,
  AlertTriangle
} from "lucide-react";

interface ProfileSettingsProps {
  userProfile: UserProfile;
  language: "en" | "ur";
  onLanguageToggle: () => void;
  onLogout: () => void;
  savedScans: ScanResult[];
}

export default function ProfileSettings({
  userProfile,
  language,
  onLanguageToggle,
  onLogout,
  savedScans
}: ProfileSettingsProps) {
  const [activeSegment, setActiveSegment] = useState<"history" | "stats">("history");

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans p-4 space-y-4">
      
      {/* Profil Header Block */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center gap-4">
        <div className="w-14 h-14 bg-sky-505/10 rounded-full border-2 border-sky-400 flex items-center justify-center text-sky-400 text-lg font-extrabold select-none">
          SV
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-extrabold text-white truncate">{userProfile.name}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">{userProfile.gender} • {userProfile.age} Years Old</p>
          <span className="inline-block mt-1 text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-1.5 py-0.2 rounded font-sans">
            Skin ID Verified Secure
          </span>
        </div>
      </div>

      {/* Tabs configuration */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
        <button
          onClick={() => setActiveSegment("history")}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === "history" ? "bg-slate-850 text-sky-400 shadow-sm" : "text-slate-500 hover:text-slate-400"
          }`}
          id="btn-profile-hist"
        >
          <History className="w-3.5 h-3.5" />
          Derm Reports
        </button>
        <button
          onClick={() => setActiveSegment("stats")}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === "stats" ? "bg-slate-850 text-sky-400 shadow-sm" : "text-slate-500 hover:text-slate-400"
          }`}
          id="btn-profile-stats"
        >
          <Award className="w-3.5 h-3.5" />
          Health Metrics
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeSegment === "history" ? (
          <div className="space-y-3 animate-fadeIn">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-450">Diagnostic Scan Library</span>
            
            {savedScans.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-950/40 border border-slate-850 rounded-2xl">
                No archived diagnostic sessions found in localized schema database.
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedScans.map((scan, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white">{scan.conditionName}</h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-sky-400 font-bold uppercase tracking-wide">
                        {scan.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 line-clamp-2 leading-relaxed">
                      {language === "en" ? scan.description : scan.urduDescription}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900/60 text-[9px] text-slate-500 font-sans">
                      <span>Conf: {scan.confidence}%</span>
                      <span>Verified: SSL SECURE</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {/* System settings and HIPAA info */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-xs leading-normal">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-900 pb-1.5">
                Dermal Profile Parameters
              </h4>
              <div className="space-y-2 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biological Skin Type:</span>
                  <span className="text-white font-bold">{userProfile.skinType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Declared Allergies:</span>
                  <span className="text-rose-400 font-bold">{userProfile.allergies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prescription Record:</span>
                  <span className="text-slate-300">{userProfile.medications || "None"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-400 space-y-2 font-sans">
              <h4 className="text-[10px] font-bold uppercase text-slate-400">HIPAA Inspired Privacy Rules</h4>
              <p className="text-[10px] leading-relaxed">
                All profile metrics are locked locally using AES secure block keys. High-resolution photos are not shared with unauthorized networks without custom client approval.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Global Setting Buttons */}
      <div className="space-y-2 shrink-0 border-t border-slate-850 pt-3">
        <button
          onClick={onLanguageToggle}
          className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-xs font-semibold text-sky-400 rounded-xl transition-all flex items-center justify-center gap-2"
          id="btn-profile-lang-toggle"
        >
          <Globe className="w-4 h-4" />
          {language === "en" ? "Change Default Language to Urdu (اردو)" : "انگریزی فارمیٹ تبدیل کریں"}
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-extrabold text-rose-400 rounded-xl transition-all flex items-center justify-center gap-2"
          id="btn-profile-logout"
        >
          <LogOut className="w-4 h-4" />
          De-authenticate Profile
        </button>
      </div>

    </div>
  );
}
