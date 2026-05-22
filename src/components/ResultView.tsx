import React, { useState } from "react";
import { ScanResult } from "../types";
import { 
  PlusCircle, 
  ChevronRight, 
  ShieldAlert, 
  ShieldCheck, 
  Clipboard, 
  ArrowLeft, 
  Globe, 
  Sparkles, 
  FileCheck,
  AlertTriangle,
  Download,
  Share2
} from "lucide-react";

interface ResultViewProps {
  result: ScanResult;
  language: "en" | "ur";
  onLanguageToggle: () => void;
  onBackToScanner: () => void;
  onSaveReport: (report: ScanResult) => void;
}

export default function ResultView({
  result,
  language,
  onLanguageToggle,
  onBackToScanner,
  onSaveReport
}: ResultViewProps) {
  const [activeSegment, setActiveSegment] = useState<"analysis" | "skincare" | "otc">("analysis");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "Severe":
        return <span className="bg-red-500/15 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Severe (شدید)</span>;
      case "Moderate":
        return <span className="bg-amber-500/15 text-yellow-400 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans">Moderate (درمیانہ)</span>;
      default:
        return <span className="bg-emerald-500/15 text-teal-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Mild (ہلکا)</span>;
    }
  };

  const copyPrescription = () => {
    const rxText = `
=== SKINVISION AI PRESCRIPTION ===
Report Date: ${new Date().toLocaleDateString()}
Analysis: ${result.conditionName} (${result.severity})
Confidence score: ${result.confidence}%

Recommended Medications:
${result.prescription.medications.map((m, idx) => `${idx+1}. ${m.name} (${m.pakistaniBrand})
   Dosage: ${m.dosage}
   Frequency: ${m.frequency}
   Duration: ${m.duration}
   Method: ${m.method}`).join("\n\n")}

CRITICAL MEDICAL WARNING: ${result.prescription.warningText}
    `;
    navigator.clipboard.writeText(rxText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPDF = () => {
    // Generate a beautiful localized medical text report for download
    const reportText = `
======================================================
SKINVISION AI CLINICAL REPORT - FOR DERMAL WELLNESS
======================================================
Generated Date: ${new Date().toISOString()}
Clinical Diagnosis: ${result.conditionName} (${result.urduConditionName})
Confidence Limit: ${result.confidence}%
Severity Category: ${result.severity}

Scientific Assessment:
${result.description}

Dermal Causes & Influencers:
${result.causes.map((c, i) => ` - ${c}`).join("\n")}

Morning Skincare Regime Checklist:
${result.morningSkincare.map((c, i) => ` [ ] ${c}`).join("\n")}

Night Skincare Regime Checklist:
${result.nightSkincare.map((c, i) => ` [ ] ${c}`).join("\n")}

Recommended Pharmacological OTC Alternatives:
${result.otcMedicines.map((m, i) => `Category: ${m.category}
 Generic Drug: ${m.genericName}
 Local Trade Brand (Pakistan): ${m.pakistaniMarketName}
 Application Rules: ${m.howToUse}
 warnings: ${m.warnings.join(", ")}`).join("\n---\n")}

Diagnostic Disclaimer Statement:
${result.prescription.warningText}
======================================================
    `;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SkinVision_Report_${result.conditionName.replace(/\s+/g, '_')}.txt`;
    link.click();
    alert("DermReport compiled successfully. Text file dispatched to system downloads.");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans">
      
      {/* Dynamic scan outcome banner */}
      <div className="relative h-44 shrink-0 bg-slate-950 overflow-hidden border-b border-slate-800">
        {result.imageUrl ? (
          <img 
            src={result.imageUrl} 
            alt="scanned area" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950 to-indigo-950"></div>
        )}
        {/* Color mask layer based on severity */}
        <div className={`absolute inset-0 opacity-20 ${result.severity === 'Severe' ? 'bg-rose-500' : 'bg-sky-500'}`}></div>
        
        {/* Floating overlays */}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5">
              {getSeverityBadge(result.severity)}
              <span className="text-[10px] font-bold text-sky-400 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-750">
                {result.confidence}% Confidence
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-1.5 drop-shadow-md">
              {language === "en" ? result.conditionName : result.urduConditionName}
            </h2>
          </div>
          
          <button 
            onClick={onLanguageToggle}
            className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border border-slate-700 bg-slate-900/95 text-sky-400 hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-md"
            id="result-lang-switch-btn"
          >
            <Globe className="w-3 h-3 text-sky-400" />
            {language === "en" ? "Urdu View" : "Eng View"}
          </button>
        </div>

        {/* Back navigation */}
        <button
          onClick={onBackToScanner}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-900/70 border border-slate-750 flex items-center justify-center text-slate-300 hover:bg-slate-850"
          id="result-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-sky-450" />
        </button>
      </div>

      {/* Prominent Disclaimer block warning */}
      <div className="bg-amber-500/5 px-4 py-2 border-b border-amber-500/10 flex items-start gap-2 text-[9px] text-amber-500 leading-normal">
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>
          {language === "en" 
            ? "Educational Advisory. Consult registered clinicians/dermatologists for proper medical treat." 
            : "صرف تعلیمی معلومات۔ حتمی تشخیص کے لیے ڈرمیٹالوجسٹ سے لازمی رجوع کریں۔"}
        </span>
      </div>

      {/* Segments Segmented Bar Controls */}
      <div className="flex bg-slate-950 p-1 border-b border-slate-850 text-sans">
        {(["analysis", "skincare", "otc"] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeSegment === seg 
                ? "bg-slate-850 text-sky-400 shadow-sm" 
                : "text-slate-500 hover:text-slate-400"
            }`}
            id={`tab-result-${seg}`}
          >
            {seg === "analysis" ? (language === "en" ? "Insight" : "تشخیص") :
             seg === "skincare" ? (language === "en" ? "Routine" : "طریقہ کار") :
             (language === "en" ? "OTC Care" : "ادویات")}
          </button>
        ))}
      </div>

      {/* Detailed panels container */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4">
        
        {activeSegment === "analysis" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Scientific diagnostic note */}
            <div className="bg-slate-950 px-4 py-3.5 rounded-xl border border-slate-850/80">
              <h3 className="text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                {language === "en" ? "Pathological Pathology Analysis" : "حیاتیاتی معائنہ"}
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-1.5">
                {language === "en" ? result.description : result.urduDescription}
              </p>
            </div>

            {/* Causes grid */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 mb-2">
                {language === "en" ? "Known Causes & Corollaries" : "عام وجوہات"}
              </h4>
              <ul className="space-y-1.5">
                {result.causes.map((c, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-300 items-start">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 shrink-0"></span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Symptoms list */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-slate-450 mb-2">
                {language === "en" ? "Dermal Cellular Symptoms" : "جلد پر علامات"}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.symptoms.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-950 rounded-lg text-[10px] border border-slate-850 text-slate-400">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutrition & lifestyle */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px]">
                <strong className="block text-sky-400 uppercase tracking-tight mb-1">Diet Suggestions</strong>
                <ul className="space-y-1 text-slate-400">
                  {result.nutritionAdvice.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[10px]">
                <strong className="block text-indigo-400 uppercase tracking-tight mb-1">Weekly Hydration Goal</strong>
                <span className="text-slate-350">{result.hydrationGoal}</span>
              </div>
            </div>
          </div>
        )}

        {activeSegment === "skincare" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Morning routine block */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center gap-1.5 text-sky-400 mb-3 border-b border-sky-400/10 pb-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Morning Skincare Routine</span>
              </div>
              <ul className="space-y-2.5">
                {result.morningSkincare.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="w-5 h-5 rounded bg-sky-505/10 border border-sky-455/20 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      AM{idx+1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Night routine block */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-850">
              <div className="flex items-center gap-1.5 text-indigo-400 mb-3 border-b border-indigo-400/10 pb-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider font-sans">Night Repair Routine</span>
              </div>
              <ul className="space-y-2.5">
                {result.nightSkincare.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="w-5 h-5 rounded bg-indigo-505/10 border border-indigo-455/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      PM{idx+1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSegment === "otc" && (
          <div className="space-y-4 animate-fadeIn">
            {/* OTC Medicines Pakistani Brand suggestions */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">
                {language === "en" ? "Recommended Pharmacological OTC Preparations" : "پیش کردہ تجویز کردہ ادویات (پاکستان مارکیٹ)"}
              </h3>
              <div className="space-y-3">
                {result.otcMedicines.map((med, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-900/50">
                        {med.category}
                      </span>
                      <span className="text-xs font-bold text-white pr-1">
                        {med.pakistaniMarketName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 leading-normal font-sans">
                      <strong>Generic:</strong> <span className="text-slate-400 font-mono text-[11px]">{med.genericName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      <strong>Instructions:</strong> {med.howToUse}
                    </div>
                    <div className="pt-1.5 border-t border-slate-900/80 text-[9px] text-rose-400 flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{med.warnings[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Simulated AI Prescription Form */}
            {result.prescription.required && (
              <div className="bg-gradient-to-r from-slate-950 to-slate-950 p-4 rounded-xl border-2 border-dashed border-sky-400/10 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5 font-sans">
                    <FileCheck className="w-4 h-4 text-sky-400" />
                    AI Prescription Standard Form Rx
                  </span>
                  <button 
                    onClick={copyPrescription}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-semibold text-sky-400 hover:bg-slate-800"
                    id="copy-rx-btn"
                  >
                    {isCopied ? "Copied!" : "Copy Rx Form"}
                  </button>
                </div>
                
                <div className="space-y-3 text-[11px] font-sans">
                  {result.prescription.medications.map((med, i) => (
                    <div key={i} className="border-b border-slate-900/60 pb-2 space-y-1">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{med.name}</span>
                        <span className="text-slate-450 text-[10px]">{med.pakistaniBrand}</span>
                      </div>
                      <div className="text-slate-405 flex flex-wrap gap-x-2 text-[10px]">
                        <span><strong>Dosage:</strong> {med.dosage}</span>
                        <span>•</span>
                        <span><strong>Freq:</strong> {med.frequency}</span>
                        <span>•</span>
                        <span><strong>Duration:</strong> {med.duration}</span>
                      </div>
                      <p className="text-[10px] text-slate-450 italic">Apply: {med.method}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[9px] text-amber-500 italic text-center">
                  “Consult a licensed dermatologist before using any prescription medication.”
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Persistent action blocks */}
      <div className="p-3 bg-slate-950 border-t border-slate-850 grid grid-cols-3 gap-2 shrink-0">
        <button
          onClick={() => {
            onSaveReport(result);
            alert("This diagnostic analysis report has been saved securely to your Cloud database.");
          }}
          className="py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          id="btn-save-report"
        >
          <Clipboard className="w-3.5 h-3.5 text-sky-400" />
          Save PDF
        </button>
        
        <button
          onClick={handleExportPDF}
          className="py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          id="btn-export-txt"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          Export Report
        </button>

        <button
          onClick={() => {
            alert(`Report is ready! Copy and share this clinical report code: SV-2026-${result.conditionName.slice(0,3).toUpperCase()}`);
          }}
          className="py-2.5 bg-gradient-to-r from-sky-550 to-indigo-650 text-slate-950 font-extrabold rounded-xl text-[10px] transition-transform active:scale-97 flex items-center justify-center gap-1.5"
          id="btn-share-doctor"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-950" />
          Share Report
        </button>
      </div>

    </div>
  );
}
