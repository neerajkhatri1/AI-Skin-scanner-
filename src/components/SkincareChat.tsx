import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, UserProfile } from "../types";
import { Send, MessageSquare, Bot, AlertTriangle, Sparkles, Loader2 } from "lucide-react";

interface SkincareChatProps {
  userProfile: UserProfile;
  language: "en" | "ur";
}

export default function SkincareChat({ userProfile, language }: SkincareChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init1",
      sender: "ai",
      content: language === "en" 
        ? "Hello Bablul! I am your clinical SkinVision AI Chatbot. I can advise you about acne, spot irritation, safe generic cream choices in Pakistan, and patch testing. What can I answer for you today?"
        : "خوش آمدید بابلو! میں آپ کا سکن ویژن اے آئی چہٹ باٹ ہوں۔ میں آپ کو ایکنی، کریموں اور پچ ٹیسٹ کے بارے میں رہنمائی فراہم کر سکتا ہوں۔ آپ مجھ سے کچھ بھی پوچھ سکتے ہیں؟",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const triggerChatCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      content: inputVal,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile
        })
      });

      const resJson = await response.json();
      if (resJson.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: "ai",
            content: resJson.reply,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        throw new Error("Chat connection timeout");
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "ai",
          content: "[Active offline buffer mode] Please perform a skin patch test strictly on small skin area behind your ear with any product before application.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-900 text-slate-100 font-sans">
      
      {/* Dynamic top bar alert */}
      <div className="bg-sky-950/20 px-4 py-2 border-b border-slate-800 flex items-center gap-1.5 text-[10px] text-sky-400">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span className="font-sans">Conversing with SkinVision GPT Engine</span>
      </div>

      {/* Message history bubble list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.sender !== "user" && (
              <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-900 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-sky-400" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
              m.sender === "user"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-medium rounded-tr-none"
                : "bg-slate-950 border border-slate-850/60 text-slate-200 rounded-tl-none font-sans"
            }`}>
              <p className="whitespace-pre-line">{m.content}</p>
              <div className={`text-[8px] text-right mt-1 ${m.sender === "user" ? "text-slate-800" : "text-slate-550"}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-sky-955 border border-sky-900 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
            </div>
            <div className="max-w-[80%] rounded-2xl p-3 text-xs bg-slate-955 border border-slate-850 text-slate-400 rounded-tl-none flex items-center gap-1.5 font-sans">
              <span>Thinking under pharmaceutical databases...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Pre-fabricated smart prompt selectors */}
      <div className="px-4 py-1.5 bg-slate-950/40 border-t border-slate-850 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {[
          "Clear acne safely?",
          "Explain patch testing",
          "Acne Aid vs Brevoxyl",
          "Dry skin morning care",
        ].map((pt, idx) => (
          <button
            key={idx}
            onClick={() => setInputVal(pt)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 rounded-lg text-[9px] text-slate-350 whitespace-nowrap active:scale-95"
          >
            {pt}
          </button>
        ))}
      </div>

      {/* Advisory footnote */}
      <div className="px-4 py-2 bg-amber-500/5 text-amber-500 text-[8px] flex items-center gap-1 shrink-0 border-t border-slate-900">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Advisory Bot. Confirm prescription drugs strictly with a validated Dermatologist.</span>
      </div>

      {/* Message submit text field */}
      <form onSubmit={triggerChatCall} className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={language === "en" ? "Ask acne guidance or medicine alternatives..." : "کیل دانوں کی صفائی...؟"}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-650 focus:outline-none focus:border-sky-505 font-sans"
          id="chat-text-input"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-450 transition-colors flex items-center justify-center text-slate-950 shadow-md"
          id="chat-send-btn"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>

    </div>
  );
}
