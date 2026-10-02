import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export const CustomerTestimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Devendra Singhal',
      location: 'Civil Lines, Jaipur',
      bead: 'Sarva Siddh Nepali Mala',
      outcome: 'Resolved 3-year business stall & revived cashflow',
      text: 'After wearing the Sarva Siddh Mala energized by Kanha Asa acharyas, our manufacturing unit cleared longstanding payment blocks within 4 months. The bead quality and silver work is genuine heirloom quality.',
      date: 'Purchased July 2026'
    },
    {
      name: 'Meenakshi Iyer',
      location: 'Indiranagar, Bengaluru',
      bead: 'Gauri Shankar Rudraksha',
      outcome: 'Restored marital calm & mutual understanding',
      text: 'We were going through intense marital friction due to planetary dosha. Pandit ji recommended the authentic Nepali Gauri Shankar. The difference in emotional atmosphere at home within weeks was noticeable.',
      date: 'Purchased August 2026'
    },
    {
      name: 'Aditya Vardhan Joshi',
      location: 'Vasant Vihar, New Delhi',
      bead: '1 Mukhi (Ek Mukhi) Gol Dana',
      outcome: 'Profound meditation focus & mental clarity',
      text: 'I had been searching for an authentic Nepali 1 Mukhi with legitimate lab X-ray papers for years. Kanha Asa provided the exact government laboratory certification. Truly rare and divine energy.',
      date: 'Purchased September 2026'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-stone-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Verified Devotee Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Real Life Transformations Across India
            </h2>
          </div>
          <div className="text-xs text-stone-400 flex items-center gap-2">
            <span className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="font-semibold text-white">4.9 / 5.0</span>
            <span aria-hidden="true">·</span>
            <span>Over 15,200 Consecrated Beads Dispatched</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 bg-stone-950/70 border border-stone-800 rounded-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-medium text-amber-400">{rev.bead}</span>
                  <span>{rev.date}</span>
                </div>

                <h3 className="text-sm font-semibold text-stone-200">
                  "{rev.outcome}"
                </h3>

                <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
                  {rev.text}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-stone-200">{rev.name}</p>
                  <p className="text-stone-500">{rev.location}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Devotee</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
