import React from "react";
import { SkinArticle } from "../types";
import { ArrowLeft, Clock, BookOpen, AlertCircle } from "lucide-react";

interface ArticleDetailProps {
  article: SkinArticle;
  language: "en" | "ur";
  onBack: () => void;
}

export default function ArticleDetail({ article, language, onBack }: ArticleDetailProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Visual Top Image */}
      <div className="relative h-44 shrink-0 bg-slate-950 border-b border-slate-800">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover opacity-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/80"></div>
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-750 flex items-center justify-center text-slate-300 hover:bg-slate-800"
          id="btn-article-back"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
        </button>

        {/* Info header */}
        <div className="absolute bottom-3 inset-x-4">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-900">
            {article.category}
          </span>
          <h2 className="text-sm font-extrabold text-white mt-1.5 drop-shadow-md">
            {language === "en" ? article.title : article.urduTitle}
          </h2>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4">
        {/* Read parameters */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-sans">
          <Clock className="w-3.5 h-3.5" />
          <span>{article.readTime}</span>
          <span>•</span>
          <span>Dermatology Advisory</span>
        </div>

        {/* Read contents */}
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-sans">
          <p className="font-semibold text-slate-100 border-l-2 border-sky-450 pl-2.5 py-1 bg-slate-950/40">
            {language === "en" ? article.summary : article.urduSummary}
          </p>

          <div className="space-y-3 pt-2">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-slate-305 text-[11px] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Patch Test warning alert block */}
        <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-[10px] text-slate-400 leading-relaxed">
          <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Patch Test Precaution Standard</span>
          </div>
          <p>
            Before deploying any acid active recommended in dermatopathology readings, always spot test a pea-sized dot over clean skin surface boundary behind your ear. Monitor for chemical burning spikes during consecutive 24 hours.
          </p>
        </div>
      </div>

    </div>
  );
}
