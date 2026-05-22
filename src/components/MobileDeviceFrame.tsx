import React from "react";
import { 
  Wifi, 
  Battery, 
  Signal, 
  ChevronLeft, 
  Camera, 
  Home, 
  MessageSquare, 
  Compass, 
  User, 
  Calendar,
  Activity,
  Award
} from "lucide-react";

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function MobileDeviceFrame({
  children,
  activeTab,
  setActiveTab,
  title,
  onBack,
  showBackButton = false
}: MobileDeviceFrameProps) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-900 flex flex-col overflow-hidden">
      {/* Speaker notch / Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
        <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
        <div className="w-8 h-1 bg-slate-900 rounded-full"></div>
        <div className="w-2.5 h-2.5 bg-sky-950 rounded-full border border-sky-900 flex items-center justify-center">
          <div className="w-1 h-1 bg-sky-400 rounded-full blur-[0.5px]"></div>
        </div>
      </div>

      {/* Action Buttons Mock on edge */}
      <div className="absolute left-[-6px] top-28 w-1.5 h-12 bg-slate-800 rounded-r-md"></div>
      <div className="absolute left-[-6px] top-44 w-1.5 h-16 bg-slate-800 rounded-r-md"></div>
      <div className="absolute left-[-6px] top-64 w-1.5 h-16 bg-slate-800 rounded-r-md"></div>
      <div className="absolute right-[-6px] top-36 w-1.5 h-20 bg-slate-800 rounded-l-md"></div>

      {/* Screen Container */}
      <div className="w-full h-full bg-slate-900 rounded-[38px] flex flex-col overflow-hidden relative border border-slate-950">
        
        {/* Status Bar */}
        <div className="h-10 px-6 pt-2 flex justify-between items-center bg-sky-950/20 text-slate-300 text-xs font-medium font-sans select-none z-43">
          <span>18:38</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px]">98%</span>
              <Battery className="w-4 h-4 text-slate-300 rotate-0" />
            </div>
          </div>
        </div>

        {/* Dynamic App Header */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between px-4 z-40">
          <div className="w-10">
            {showBackButton ? (
              <button 
                onClick={onBack}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-300"
                id="mob-back-btn"
              >
                <ChevronLeft className="w-5 h-5 text-sky-400" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          <span className="text-slate-100 font-semibold tracking-tight text-sm flex items-center gap-1">
            {title}
          </span>
          <div className="w-10 flex justify-end">
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-sky-400 font-bold">
              SV
            </div>
          </div>
        </div>

        {/* Main Feed Content Panel */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-900 text-slate-100 flex flex-col relative">
          {children}
        </div>

        {/* Bottom Simulated Navigation bar */}
        {activeTab !== "auth" && activeTab !== "disclaimer" && (
          <div className="h-14 bg-slate-950/95 border-t border-slate-850 flex items-center justify-around px-2 z-40 pb-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center w-12 h-10 transition-all ${
                activeTab === "dashboard" ? "text-sky-400 scale-105" : "text-slate-500 hover:text-slate-400"
              }`}
              id="mob-tab-dash"
            >
              <Home className="w-[18px] h-[18px]" />
              <span className="text-[9px] mt-1 font-sans">Home</span>
            </button>

            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex flex-col items-center justify-center w-12 h-10 transition-all ${
                activeTab === "scanner" || activeTab === "result" ? "text-sky-400 scale-105" : "text-slate-500 hover:text-slate-400"
              }`}
              id="mob-tab-scan"
            >
              <div className="relative -top-3 w-10 h-10 bg-sky-500 hover:bg-sky-450 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20 border-3 border-slate-950 transition-colors">
                <Camera className="w-[18px] h-[18px] text-black stroke-[2.5]" />
              </div>
              <span className="text-[9px] -mt-2 font-sans">Scan</span>
            </button>

            <button
              onClick={() => setActiveTab("chatbot")}
              className={`flex flex-col items-center justify-center w-12 h-10 transition-all ${
                activeTab === "chatbot" ? "text-sky-400 scale-105" : "text-slate-500 hover:text-slate-400"
              }`}
              id="mob-tab-chat"
            >
              <MessageSquare className="w-[18px] h-[18px]" />
              <span className="text-[9px] mt-1 font-sans">DermAI</span>
            </button>

            <button
              onClick={() => setActiveTab("tracker")}
              className={`flex flex-col items-center justify-center w-12 h-10 transition-all ${
                activeTab === "tracker" ? "text-sky-400 scale-105" : "text-slate-500 hover:text-slate-400"
              }`}
              id="mob-tab-track"
            >
              <Activity className="w-[18px] h-[18px]" />
              <span className="text-[9px] mt-1 font-sans">Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center justify-center w-12 h-10 transition-all ${
                activeTab === "profile" ? "text-sky-400 scale-105" : "text-slate-500 hover:text-slate-400"
              }`}
              id="mob-tab-prof"
            >
              <User className="w-[18px] h-[18px]" />
              <span className="text-[9px] mt-1 font-sans">Profile</span>
            </button>
          </div>
        )}

        {/* Physical Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full z-50"></div>
      </div>
    </div>
  );
}
