import React from "react";
import { AlertTriangle, ShieldAlert, BadgeCheck, CheckCircle, Info } from "lucide-react";

interface DisclaimerModalProps {
  onAccept: () => void;
  language: "en" | "ur";
  onLanguageToggle: () => void;
}

export default function DisclaimerModal({ onAccept, language, onLanguageToggle }: DisclaimerModalProps) {
  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 font-sans">
      <div className="flex-1 flex flex-col justify-center py-4">
        {/* Animated Beacon Header */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-rose-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Language switch bar */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={onLanguageToggle}
            className="px-3 py-1 text-xs font-semibold rounded-full border border-slate-700 bg-slate-800 text-sky-400 hover:bg-slate-750 transition-colors"
            id="lang-toggle-disc"
          >
            {language === "en" ? "Urdu / اردو" : "English Format"}
          </button>
        </div>

        {/* Main notice text card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          {language === "en" ? (
            <>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                Mandatory Clinical Disclaimer
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you for using <strong className="text-sky-400">SkinVision AI</strong>. Before deploying face or spot scanning, please review the critical legal and medical conditions below:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex gap-2 text-xs text-amber-400 leading-relaxed bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    <strong>Not a Doctor:</strong> This application utilizes advanced machine learning computer vision to parse structural patterns, but is NOT a licensed dermatologist.
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>No Formal Diagnosis:</strong> Generated analysis values are designed strictly for educational exploration, routine tracking, and localized OTC awareness.
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>Consult a Professional:</strong> Always secure a localized prescription and consultation with a registered clinical professional before employing any active agent or drug.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-right space-y-3" dir="rtl">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center justify-start gap-2">
                لازمی طبی ڈس کلیمر (انتباہ)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                سکن ویژن اے آئی استعمال کرنے کا شکریہ۔ اسکین شروع کرنے سے پہلے برائے مہربانی درج ذیل انتباہ کو بغور پڑھیں:
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex gap-2 text-xs text-amber-400 leading-relaxed bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10 text-right">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    <strong>ڈاکٹر کی متبادل نہیں:</strong> یہ ایپ صرف معلومات کے لیے کمپیوٹر ویژن کارکردگی کا استعمال کرتی ہے۔ یہ باقاعدہ معائنے یا ڈاکٹر کے علاج کا نعم البدل نہیں ہے۔
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 leading-relaxed text-right">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>غیر حتمی نتائج:</strong> کمپیوٹر کے تیار کردہ نتائج صرف آپ کی رہنمائی اور آگاہی کی غرض سے تیار کیے جاتے ہیں۔
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 leading-relaxed text-right">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>
                    <strong>ڈرمیٹالوجسٹ سے رجوع کریں:</strong> کسی بھی کریم، فیس واش یا دوا کے باقاعدہ استعمال سے قبل کسی تصدیق شدہ ماہر امراضِ جلد سے لازمی مشورہ کریں۔
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action panel */}
      <div className="space-y-3 pb-2 pt-4 border-t border-slate-800">
        <button
          onClick={onAccept}
          className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-450 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-500/10 active:scale-98"
          id="disc-accept-btn"
        >
          {language === "en" ? "I Accept & Understand Terms" : "میں قبول کرتا ہوں - اسکین شروع کریں"}
        </button>
        <p className="text-[10px] text-center text-slate-500">
          SkinVision HIPAA compliance module • Secure SSL V3
        </p>
      </div>
    </div>
  );
}
