import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Gem } from 'lucide-react';

interface TopDreamInstallmentTickerProps {
  onOpenInstallments: () => void;
}

export const TopDreamInstallmentTicker: React.FC<TopDreamInstallmentTickerProps> = ({
  onOpenInstallments,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-500/40 text-stone-100 overflow-hidden py-2 sm:py-2.5 z-40 shadow-inner">
      <div className="flex items-center">
        {/* Fixed Left Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-stone-950 font-bold text-[11px] uppercase tracking-wider shrink-0 z-10 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>सपना पूरा करें</span>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex gap-8 w-max items-center hover:[animation-play-state:paused] cursor-pointer" onClick={onOpenInstallments}>
            {[1, 2].map((key) => (
              <div key={key} className="flex items-center gap-6 text-xs sm:text-[13px] font-medium tracking-wide">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-amber-300 font-bold">रुद्राक्ष लेना चाहते हैं और यह आपका ड्रीम (सपना) है? परेशान मत होइए!</span>
                </div>

                <div className="flex items-center gap-2 text-stone-200">
                  <span>अब आप</span>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/50 rounded font-bold font-mono text-xs">
                    बहुत ही आसान किस्तों में (Installments)
                  </span>
                  <span>या थोड़ा-थोड़ा पैसा जमा करके भी अपना मनचाहा दुर्लभ रुद्राक्ष 100% बुक करवा सकते हैं!</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>0% ब्याज · पहली किस्त से वही सेम दाना तिजोरी में आपके नाम रिजर्व · पूर्ण भुगतान पर लैब सर्टिफिकेट सहित होम डिलीवरी</span>
                </div>

                <div className="flex items-center gap-2 text-amber-200 font-semibold text-xs">
                  <span className="text-red-400">📺 YouTube: @kanhaasaastrorudraksha</span>
                  <span className="text-pink-400">📸 Insta: @kanha.asa</span>
                  <span className="text-blue-400">📘 FB: @KanhaASA</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInstallments();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <span>आसान किस्त प्लान व सर्टिफिकेट देखें</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <span className="text-amber-500/60 font-bold">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
