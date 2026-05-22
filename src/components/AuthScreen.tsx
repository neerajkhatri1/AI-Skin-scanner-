import React, { useState } from "react";
import { UserProfile } from "../types";
import { LogIn, UserPlus, Shield, UserCheck, Key, HelpCircle } from "lucide-react";

interface AuthScreenProps {
  onSuccess: (profile: UserProfile, isGuest: boolean) => void;
  language: "en" | "ur";
}

export default function AuthScreen({ onSuccess, language }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("user@skinvision.pk");
  const [password, setPassword] = useState<string>("dermatology2026");
  const [name, setName] = useState<string>("Bablul Khatri");
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<string>("Male");
  const [skinType, setSkinType] = useState<string>("Combination");
  const [allergies, setAllergies] = useState<string>("None");
  const [medications, setMedications] = useState<string>("None");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter email and password credentials.");
      return;
    }
    
    // Assemble mock user profile from fields
    const userProfile: UserProfile = {
      name: isLogin ? "Bablul Khatri" : name,
      age: isLogin ? 24 : Number(age),
      gender: isLogin ? "Male" : gender,
      skinType: isLogin ? "Combination" : skinType,
      allergies: isLogin ? "None" : allergies,
      history: "Cleared standard youth acne lesions",
      medications: isLogin ? "None" : medications,
      language: language
    };

    onSuccess(userProfile, false);
  };

  const loginAsGuest = () => {
    const guestProfile: UserProfile = {
      name: "Guest Monitor",
      age: 25,
      gender: "Not specified",
      skinType: "Oily",
      allergies: "None declared",
      history: "Unknown baseline",
      medications: "None",
      language: language
    };
    onSuccess(guestProfile, true);
  };

  return (
    <div className="flex-1 flex flex-col justify-start p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-100 font-sans">
      
      {/* Visual Identity Logo Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-505/10 rounded-2xl border border-sky-500/20 mb-3 shadow-inner shadow-sky-500/20">
          <Shield className="w-6 h-6 text-sky-400 animate-pulse" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
          SkinVision AI
        </h1>
        <p className="text-[11px] text-slate-400 mt-1">
          {language === "en" ? "Medical-Grade Diagnostic Support" : "طبی معیار کا سکن اینالائزر"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-5">
        <button
          onClick={() => { setIsLogin(true); setErrorMsg(""); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            isLogin ? "bg-slate-850 text-sky-400 shadow" : "text-slate-400 hover:text-slate-300"
          }`}
          id="tab-btn-login"
        >
          <LogIn className="w-3.5 h-3.5" />
          {language === "en" ? "Sign In" : "لاگ ان"}
        </button>
        <button
          onClick={() => { setIsLogin(false); setErrorMsg(""); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            !isLogin ? "bg-slate-850 text-sky-400 shadow" : "text-slate-400 hover:text-slate-300"
          }`}
          id="tab-btn-reg"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {language === "en" ? "Register" : "رجسٹریشن"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 text-center animate-shake">
          {errorMsg}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleAction} className="space-y-3.5 flex-1 flex flex-col justify-between">
        
        <div className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address / ای میل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="e.g. bablu@gmail.com"
              id="auth-input-email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password / پاس ورڈ
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="••••••••••••"
              id="auth-input-pass"
            />
          </div>

          {/* Registration specific blocks */}
          {!isLogin && (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none font-sans"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Skin Type
                  </label>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="Dry">Dry skin</option>
                    <option value="Oily">Oily skin</option>
                    <option value="Combination">Combination</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                    placeholder="e.g. sulfur, retinol"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action button rows */}
        <div className="space-y-3.5 pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-450 hover:to-indigo-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-1.5"
            id="auth-submit-btn"
          >
            {isLogin ? (
              <>
                <LogIn className="w-4 h-4 text-black" />
                {language === "en" ? "Access SkinVision Engine" : "سکن ویژن میں لاگ ان کریں"}
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-black" />
                {language === "en" ? "Create Account & Save Profile" : "نیا اکاؤنٹ بنائیں"}
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <button 
              type="button" 
              onClick={() => alert("Password reset link has been dispatched to: " + email)}
              className="hover:text-slate-400 underline font-sans"
              id="auth-forgot-btn"
            >
              Forgot Password?
            </button>
            <span className="text-slate-600">•</span>
            <button 
              type="button" 
              onClick={loginAsGuest}
              className="text-sky-400 hover:text-sky-300 font-semibold font-sans"
              id="auth-guest-btn"
            >
              Configure Guest Mode
            </button>
          </div>

          {/* Social login buttons */}
          <div className="pt-2 border-t border-slate-850">
            <button
              type="button"
              onClick={() => {
                const googleProfile: UserProfile = {
                  name: "Khatri Secure User",
                  age: 26,
                  gender: "Male",
                  skinType: "Combination",
                  allergies: "None",
                  history: "Preconfigured OAuth",
                  medications: "None",
                  language: language
                };
                onSuccess(googleProfile, false);
              }}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 py-2.5 rounded-xl text-[11px] font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
              id="auth-google-btn"
            >
              <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.25.61 4.45 1.635l2.45-2.45C17.29 1.48 14.88 1 12.24 1 6.59 1 2 5.59 2 11.24s4.59 10.24 10.24 10.24c5.9 0 9.81-4.15 9.81-9.98 0-.67-.06-1.3-.17-1.92H12.24z"/>
              </svg>
              Auth with Google Account
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
