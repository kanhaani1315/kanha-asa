import React from 'react';
import { HERO_IMAGE } from '../data/mockData';
import { ShieldCheck, Sparkles, MessageCircle, ArrowRight, Phone, Bot, PhoneCall } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { trackMetaEvent } from '../utils/metaTracker';
import { KanhaLogo } from './KanhaLogo';
import { AiCallingIcon, KanhaAiChatIcon } from './AiIcons';
import { YouTubeIcon } from './SocialIcons';

interface HeroProps {
  onFindMukhiClick: () => void;
  onExploreClick: () => void;
  onOpenAiChat: () => void;
  onOpenAiCalling: () => void;
  merchantPhone: string;
}

export const Hero: React.FC<HeroProps> = ({
  onFindMukhiClick,
  onExploreClick,
  onOpenAiChat,
  onOpenAiCalling,
  merchantPhone,
}) => {
  const handleConsultWhatsApp = () => {
    trackMetaEvent('Contact', {
      action: 'hero_whatsapp_click',
      intent: 'astro_consultation'
    });
    const url = generateWhatsAppUrl(
      merchantPhone,
      'Pranam Acharya Ji! 🕉️ I saw your website www.kanhaasa.com and would like a personalized 1 to 21 Mukhi Rudraksha & Gemstone recommendation for my Rashi.'
    );
    window.open(url, '_blank');
  };

  return (
    <section id="home" className="relative bg-stone-950 text-stone-100 overflow-hidden border-b border-stone-800">
      {/* Background with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Authentic Himalayan Nepali Rudraksha on silk and sacred brass plate"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-30 object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl space-y-6">
          {/* Official Brand Lockup & ISO Certification */}
          <div className="flex items-center gap-3">
            <KanhaLogo size={50} />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kanha Asa Astro & Rudraksha · ISO 9001:2015 Certified</span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans mt-0.5">
                Vedic Astro Consultation · 24x7 AI Voice Calling & Live Support
              </p>
            </div>
          </div>

          {/* Primary Display Headline (Balanced) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-tight" style={{ textWrap: 'balance' }}>
            Authentic 1 to 21 Mukhi Nepali Rudrakshas & Certified Gemstones
          </h1>

          {/* Value proposition description */}
          <p className="text-base sm:text-lg text-stone-300 font-sans leading-relaxed max-w-2xl">
            100% genuine Himalayan Nepali Rudrakshas & natural Astrological Gemstones with official Kanha Asa ISO 9001:2015 Identification Reports, X-Ray seed analysis, and 1,008 Vedic mantra energization. Buy directly on <strong className="text-amber-400">www.kanhaasa.com</strong> with 10%, 15% & 25% discounts and Free Shipping!
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                trackMetaEvent('ViewContent', { content_name: 'Mukhi Finder Lead CTA' });
                onFindMukhiClick();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg shadow-amber-950/50 whitespace-nowrap cursor-pointer"
            >
              <span>Discover My Mukhi & Vouchers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold rounded-lg bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-900/60 transition-colors whitespace-nowrap cursor-pointer"
              title="AI ज्योतिषी: नाम न्यूमरोलॉजी, मोबाइल नंबर जांच, लो-शू ग्रिड"
            >
              <KanhaAiChatIcon size={18} />
              <span>AI ज्योतिषी (ग्रिड व मोबाइल जांच)</span>
            </button>

            <button
              onClick={onOpenAiCalling}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-950/90 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 transition-colors whitespace-nowrap cursor-pointer"
              title="AI Voice Call Consultation"
            >
              <AiCallingIcon size={18} />
              <span>AI Voice Call (AI Dials You)</span>
            </button>

            <a
              href="https://www.youtube.com/@kanhaasaastrorudraksha"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold rounded-lg bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-800/80 transition-colors whitespace-nowrap"
              title="कान्हा असा यूट्यूब चैनल (@kanhaasaastrorudraksha) - 1 से 21 मुखी वीडियो देखें"
            >
              <YouTubeIcon size={18} className="fill-current text-red-500" />
              <span>यूट्यूब वीडियो (@kanhaasaastrorudraksha)</span>
            </a>
          </div>

          {/* Zero-Pill Trust Markers */}
          <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-y-2 text-xs text-stone-400 font-medium">
            <div className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kanha Asa ISO 9001:2015 Report</span>
            </div>
            <span className="mx-3 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
            <span>Origin: Nepal (High Himalayan Ridge)</span>
            <span className="mx-3 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-emerald-400">Free Pan-India Shipping</span>
            <span className="mx-3 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
            <span>COD Available (₹150)</span>
            <span className="mx-3 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-amber-300">Tier Discounts: 10% / 15% / 25% OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
};
