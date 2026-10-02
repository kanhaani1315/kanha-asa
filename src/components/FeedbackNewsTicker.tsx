import React from 'react';
import { Star, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export const FeedbackNewsTicker: React.FC = () => {
  const newsItems = [
    {
      author: 'Devendra S. (Jaipur)',
      bead: 'Sarva Siddh Mala (1-14 Mukhi)',
      feedback: 'Cleared longstanding business debts within 4 months of wearing. Genuine Nepal quality!',
      rating: 5,
      time: 'Verified Purchaser'
    },
    {
      author: 'Meenakshi I. (Bengaluru)',
      bead: 'Gauri Shankar Rudraksha',
      feedback: 'Harmonized marital atmosphere and emotional calm. Acharya ji consecration report is 100% authentic.',
      rating: 5,
      time: 'Verified Purchaser'
    },
    {
      author: 'Vikramaditya R. (Jodhpur)',
      bead: '14 Mukhi Devamani',
      feedback: 'Protection during Shani Sade Sati. Felt immediate grounding and confidence in court victory.',
      rating: 5,
      time: 'Verified Purchaser'
    },
    {
      author: 'Sunil K. (Mumbai)',
      bead: '7 Mukhi Mahalakshmi + Red Coral',
      feedback: 'Ordered online on www.kanhaasa.com. Got 15% discount and fast free delivery with X-Ray lab card.',
      rating: 5,
      time: 'Verified Purchaser'
    },
    {
      author: 'Pooja Tiwari (Delhi NCR)',
      bead: '1 Mukhi South Dana Silver Trinetra',
      feedback: 'Magnificent silver eye carving. Wearing during daily Mahamrityunjaya meditation with profound stillness.',
      rating: 5,
      time: 'Verified Purchaser'
    },
    {
      author: 'Dr. Anand Joshi (Ahmedabad)',
      bead: '108 Nepali Japa Mala',
      feedback: 'Natural Nepali beads with heavy grain density. Authentic ISO 9001:2015 report provided.',
      rating: 5,
      time: 'Verified Purchaser'
    }
  ];

  return (
    <div className="bg-stone-900 border-y border-stone-800 py-2.5 overflow-hidden select-none">
      <div className="flex items-center">
        {/* News Flash Badge */}
        <div className="bg-amber-500 text-stone-950 px-3 py-1 font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow z-10">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Devotee Newsflash</span>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee-slow flex gap-8 w-max items-center">
            {[...newsItems, ...newsItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-stone-300 shrink-0">
                <span className="font-semibold text-white">{item.author}:</span>
                <span className="text-amber-300 font-medium">"{item.feedback}"</span>
                <span className="text-stone-400 font-mono text-[11px]">({item.bead})</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{item.time}</span>
                </span>
                <span className="text-stone-700 font-bold" aria-hidden="true">///</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
