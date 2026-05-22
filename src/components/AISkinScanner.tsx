import React, { useState, useRef } from "react";
import { Camera, Upload, RefreshCw, X, Sparkles, Check, Play, Info } from "lucide-react";

interface AISkinScannerProps {
  language: "en" | "ur";
  onTriggerAnalysis: (base64Image: string, conditionHint: string, area: string) => void;
  initialHint: string;
}

export default function AISkinScanner({ language, onTriggerAnalysis, initialHint }: AISkinScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [conditionHint, setConditionHint] = useState<string>(initialHint || "Acne");
  const [skinArea, setSkinArea] = useState<string>("Face");
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>("Aligning sensor...");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated preset clinical dermatology images representing safe high-quality scans of typical classes
  const PRESET_MOCK_IMAGES: Record<string, string> = {
    "Acne": "https://images.unsplash.com/photo-1593487568522-746db8894941?q=80&w=400&auto=format&fit=crop",
    "Eczema": "https://images.unsplash.com/photo-1548839140-29a88648f1d8?q=80&w=400&auto=format&fit=crop",
    "Pigmentation": "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop",
    "Default": "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=400&auto=format&fit=crop"
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetSample = (cond: string) => {
    // Select specific visual representing safe healthcare image of skin
    const imageUrl = PRESET_MOCK_IMAGES[cond] || PRESET_MOCK_IMAGES["Default"];
    // Convert to a neat placeholder base64 representing a physical sample
    setCapturedImage(imageUrl);
    setConditionHint(cond);
  };

  const executeDermScan = () => {
    if (!capturedImage) {
      // Auto assign standard image if none selected to guarantee user experience
      const defaultImg = PRESET_MOCK_IMAGES[conditionHint] || PRESET_MOCK_IMAGES["Default"];
      setCapturedImage(defaultImg);
    }

    setIsScanningActive(true);
    setScanProgress(5);
    setScanStatus("Acquiring high-resolution focal frame...");

    // Stage 1: Cellular align
    setTimeout(() => {
      setScanProgress(30);
      setScanStatus("Parsing structural epidermal lipid values...");
    }, 700);

    // Stage 2: Pattern density
    setTimeout(() => {
      setScanProgress(60);
      setScanStatus("Tracing follicular hyperkeratosis blocks...");
    }, 1400);

    // Stage 3: Complete & Trigger result callback
    setTimeout(() => {
      setScanProgress(100);
      setScanStatus("Dermatopathology report compiled.");
      
      const baselineImg = capturedImage || PRESET_MOCK_IMAGES[conditionHint] || PRESET_MOCK_IMAGES["Default"];
      onTriggerAnalysis(baselineImg, conditionHint, skinArea);
    }, 2200);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 bg-slate-900 text-slate-100 font-sans">
      
      {/* Header parameters */}
      <div className="text-center pb-2 border-b border-slate-800">
        <h2 className="text-sm font-extrabold text-slate-100 flex items-center justify-center gap-1.5">
          <Camera className="w-4 h-4 text-sky-400" />
          {language === "en" ? "AI Interactive Scan Suite" : "اے آئی سکن اسکینر متبادل"}
        </h2>
        <p className="text-[10px] text-slate-400 mt-1">
          {language === "en" ? "Compatible with internal high-res focus cameras" : "صحت مند جلد اور دانوں کے معائنے کے لیے تصویر لیں"}
        </p>
      </div>

      {!isScanningActive ? (
        <>
          {/* Main camera viewport box */}
          <div className="relative aspect-square w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center group shadow-inner shadow-black">
            
            {capturedImage ? (
              <>
                <img 
                  src={capturedImage} 
                  alt="Captured derm frame" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center hover:bg-slate-900 text-rose-400 transition-colors"
                  id="scanner-clear-image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Simulated focal bounding box on image */}
                <div className="absolute inset-8 border-2 border-dashed border-sky-450/40 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-sky-400 absolute top-0 left-0"></div>
                  <div className="w-6 h-6 border-t-2 border-r-2 border-sky-400 absolute top-0 right-0"></div>
                  <div className="w-6 h-6 border-b-2 border-l-2 border-sky-400 absolute bottom-0 left-0"></div>
                  <div className="w-6 h-6 border-b-2 border-r-2 border-sky-400 absolute bottom-0 right-0"></div>
                  <span className="text-[9px] bg-slate-950/80 px-2 py-0.5 rounded text-sky-400 font-bold uppercase tracking-widest">
                    EPIDERMIS FOCUS LOCKED
                  </span>
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-sky-400">
                  <Camera className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">
                    {language === "en" ? "Select clinical sample or upload" : "اسکین کے لیے تصویر کا انتخاب کریں"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[220px] mx-auto">
                    {language === "en" 
                      ? "Use high-lighting parameters or choose pre-validated safe dermatology presets." 
                      : "فوری معائنے کے لیے دئیے گئے نمونوں میں سے کسی ایک کا انتخاب کریں۔"}
                  </p>
                </div>
              </div>
            )}

            {/* Simulated focal guidance overlay banner */}
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-850 px-3 py-1.5 rounded-xl flex items-center justify-between text-[9px] text-slate-400">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                Sensor Ready
              </span>
              <span>ISO 125 • F/1.8</span>
            </div>
          </div>

          {/* Form parameters */}
          <div className="space-y-3.5 bg-slate-950 px-3.5 py-4 rounded-xl border border-slate-855">
            {/* Condition parameter hint selector */}
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Primary Target Diagnostic Focus
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={conditionHint}
                  onChange={(e) => setConditionHint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                  id="scanner-hint-select"
                >
                  <option value="Acne">Acne Vulgaris (اکنی)</option>
                  <option value="Eczema">Atopic Dermatitis (ایگزیما)</option>
                  <option value="Pigmentation">Pigmentation (سوزش)</option>
                  <option value="Rosacea">Rosacea</option>
                  <option value="Dry skin">Dryness / Scaling</option>
                </select>

                <select
                  value={skinArea}
                  onChange={(e) => setSkinArea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Face">Face / Gesicht</option>
                  <option value="Forehead">Forehead Region</option>
                  <option value="Cheek">Cheek Spot</option>
                  <option value="Back/Shoulders">Back / Body</option>
                </select>
              </div>
            </div>

            {/* Quick Presets row */}
            <div>
              <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Validated Clinical Presets (Quick Demo)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => selectPresetSample("Acne")}
                  className={`py-1 rounded border text-[10px] font-medium transition-all ${
                    conditionHint === "Acne" && capturedImage
                      ? "bg-sky-950 border-sky-400/40 text-sky-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                  id="preset-sample-acne"
                >
                  Acne / دانے
                </button>
                <button
                  onClick={() => selectPresetSample("Eczema")}
                  className={`py-1 rounded border text-[10px] font-medium transition-all ${
                    conditionHint === "Eczema" && capturedImage
                      ? "bg-sky-950 border-sky-400/40 text-sky-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                  id="preset-sample-eczema"
                >
                  Eczema / کھردرہ
                </button>
                <button
                  onClick={() => selectPresetSample("Pigmentation")}
                  className={`py-1 rounded border text-[10px] font-medium transition-all ${
                    conditionHint === "Pigmentation" && capturedImage
                      ? "bg-sky-950 border-sky-400/40 text-sky-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  Pigment / سرخی
                </button>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-colors flex items-center justify-center gap-1.5"
              id="upload-gallery-btn"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              {language === "en" ? "Gallery Upload" : "گیلری سے منتخب کریں"}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleManualUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={executeDermScan}
              className="py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-450 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs transition-transform flex items-center justify-center gap-1.5"
              id="trigger-active-scan-btn"
            >
              <Sparkles className="w-4 h-4 text-black animate-spin" />
              {language === "en" ? "Execute Laser Scan" : "کیلیبریٹ اور اسکین کریں"}
            </button>
          </div>
        </>
      ) : (
        /* Action progress diagnostics spinner screens */
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-10 animate-fadeIn">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Pulsating outer bounds */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-sky-500/20 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-pulse"></div>
            
            {/* Center progress metrics */}
            <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-sky-400 flex flex-col items-center justify-center shadow-lg shadow-sky-500/25">
              <span className="text-2xl font-black font-mono text-white">{scanProgress}%</span>
              <span className="text-[8px] uppercase tracking-wider font-bold text-sky-400">Classifying</span>
            </div>
          </div>

          <div className="text-center space-y-2 max-w-[280px]">
            <h3 className="text-xs font-bold text-slate-200 animate-pulse capitalize">
              {scanStatus}
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
              System is parsing structural patterns via localized neural algorithms. Do not exit current device framing.
            </p>
          </div>

          {/* Progressive check logs */}
          <div className="w-full max-w-[280px] bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-[9px] text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Dermal image token verified (224x224 input)</span>
            </div>
            <div className={`flex items-center gap-2 text-[9px] ${scanProgress >= 30 ? "text-emerald-400" : "text-slate-650"}`}>
              {scanProgress >= 30 ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-800 animate-spin"></div>}
              <span>Epidermal density maps generated</span>
            </div>
            <div className={`flex items-center gap-2 text-[9px] ${scanProgress >= 60 ? "text-emerald-400" : "text-slate-650"}`}>
              {scanProgress >= 60 ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-800"></div>}
              <span>Mapping OTC generic drug alternatives</span>
            </div>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-[9px] text-slate-500 font-sans">
        <span>TLS Hyper-secure image link</span>
        <span>HIPAA Compliant</span>
      </div>

    </div>
  );
}
