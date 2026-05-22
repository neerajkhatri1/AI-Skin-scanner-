import React from "react";
import { UserProfile, SkinArticle } from "../types";
import { SKIN_ARTICLES_DATA } from "../data";
import { 
  Sparkles, 
  Droplet, 
  Moon, 
  Sun, 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen
} from "lucide-react";

interface DashboardProps {
  profile: UserProfile;
  language: "en" | "ur";
  onTriggerScan: (hint?: string) => void;
  onReadArticle: (article: SkinArticle) => void;
  onNavigateTab: (tab: string) => void;
  score: number;
  waterIntake: number;
}

export default function Dashboard({
  profile,
  language,
  onTriggerScan,
  onReadArticle,
  onNavigateTab,
  score,
  waterIntake
}: DashboardProps) {
  
  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 bg-slate-900 text-slate-100 font-sans">
      
      {/* Clinician Warm Welcome Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-sky-400">
            {language === "en" ? "Medical ID Synced" : "پروفائل کارڈ منسلک ہے"}
          </p>
          <h2 className="text-sm font-extrabold text-slate-100 mt-0.5">
            {language === "en" ? `Assoc. ${profile.name}` : `${profile.name} خوش آمدید`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
            {language === "en" ? `${profile.skinType} Skin` : `${profile.skinType} جلد`}
          </div>
        </div>
      </div>

      {/* Wellness Diagnostics Bento Section */}
      <div className="grid grid-cols-2 gap-3">
        {/* Skin Wellness Meter */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-3.5 rounded-2xl border border-slate-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tight">Skin Score</span>
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
              <span className="text-xs text-indigo-400">/100</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 line-clamp-1">
            {language === "en" ? "Steady biological turgor" : "مستحکم اور صحت مند کثافت"}
          </div>
        </div>

        {/* Water Hydration Counter */}
        <div 
          onClick={() => onNavigateTab("tracker")}
          className="bg-gradient-to-br from-slate-900 to-sky-950/40 p-3.5 rounded-2xl border border-slate-850 flex flex-col justify-between cursor-pointer group hover:bg-slate-850/60 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-300 uppercase tracking-tight">Hydration</span>
            <Droplet className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">{waterIntake}</span>
              <span className="text-xs text-sky-400">/10 gl</span>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 line-clamp-1">
            {language === "en" ? "Refill recommended" : "پانی کا ہدف مکمل کریں"}
          </div>
        </div>
      </div>

      {/* Quick Access Diagnosis Trigger Cards */}
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          {language === "en" ? "Immediate AI Pathology Analyses" : "فوری اے آئی اسکنر"}
        </h3>
        <div 
          onClick={() => onTriggerScan()}
          className="p-4 bg-gradient-to-r from-sky-500/10 to-indigo-650/10 border border-sky-500/30 rounded-2xl cursor-pointer hover:border-sky-450 transition-all shadow-lg group relative overflow-hidden"
          id="dash-scan-banner"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400">
                <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-widest">{language === "en" ? "Active Scanner" : "اسکینر شروع کریں"}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 pr-10">
                {language === "en" ? "Perform Multimodal Photographic Scan" : "چہرے یا متاثرہ جلد کا معائنہ کریں"}
              </h4>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                {language === "en" 
                  ? "Captures dermal patterns to parse pores, moisture limits, or active lesions." 
                  : "کیمرہ یا گیلری سے فوٹو لے کر دانوں اور خشکی کا گہرا معائنہ کریں۔"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Common Skin categories (Click to auto-hint scanner) */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          {language === "en" ? "Search Conditions Directly" : "مخصوص بیماری کا معائنہ"}
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["Acne", "Eczema", "Pigmentation", "Rosacea", "Dry Skin", "Dark circles"].map((cond, idx) => (
            <button
              key={idx}
              onClick={() => onTriggerScan(cond)}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium hover:bg-slate-850 hover:border-slate-700 transition-all whitespace-nowrap active:scale-95"
              id={`hint-cond-${idx}`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Skincare Education Feed Section */}
      <div className="flex-1 flex flex-col min-h-[180px]">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-850">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {language === "en" ? "Clinical Publications & Guidance" : "طبی معلومات اور رہنمائی"}
          </h4>
          <BookOpen className="w-4 h-4 text-slate-500" />
        </div>
        
        <div className="space-y-2.5 flex-1 overflow-y-auto no-scrollbar">
          {SKIN_ARTICLES_DATA.map((art) => (
            <div
              key={art.id}
              onClick={() => onReadArticle(art)}
              className="p-3 bg-slate-950 border border-slate-850/60 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors flex gap-3 group"
              id={`art-item-${art.id}`}
            >
              <img 
                src={art.image} 
                alt="article thumb" 
                className="w-16 h-16 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] uppercase tracking-wider font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded">
                      {art.category}
                    </span>
                    <span className="text-[8px] text-slate-550 font-sans">{art.readTime}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 mt-1 line-clamp-1 group-hover:text-sky-400 transition-colors">
                    {language === "en" ? art.title : art.urduTitle}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {language === "en" ? art.summary : art.urduSummary}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Warning Disclaimer Footnote */}
      <div className="p-3 bg-slate-950 border border-slate-850/80 rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="text-[9px] text-slate-400 leading-relaxed font-sans">
          <strong>Security Protocol:</strong> All scans run under dynamic SSL V3 layers. Image transfers are clinical encrypted models.
        </p>
      </div>

    </div>
  );
}
