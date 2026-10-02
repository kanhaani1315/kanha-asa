import React from 'react';
import { ShoppingBag, MessageCircle, BarChart3, Phone, Bot, Sparkles, PhoneCall } from 'lucide-react';
import { KanhaLogo } from './KanhaLogo';
import { AiCallingIcon, KanhaAiChatIcon } from './AiIcons';
import { YouTubeIcon } from './SocialIcons';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeView: 'store' | 'meta-hub';
  setActiveView: (view: 'store' | 'meta-hub') => void;
  merchantPhone: string;
  onOpenAiChat: () => void;
  onOpenAiCalling: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeView,
  setActiveView,
  merchantPhone,
  onOpenAiChat,
  onOpenAiCalling,
}) => {
  const handleDirectWhatsApp = () => {
    const url = generateWhatsAppUrl(
      merchantPhone,
      'Pranam Acharya Ji! 🕉️ I want guidance for choosing the right Nepali Rudraksha from Kanha Asa.'
    );
    window.open(url, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 text-stone-100 border-b border-amber-900/40 backdrop-blur-md">
      {/* Announcement Strip */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 text-center border-b border-stone-800 font-medium flex items-center justify-center flex-wrap gap-y-1">
        <span className="text-amber-300 font-semibold">100% Himalayan Nepali 1 to 21 Mukhi</span>
        <span className="mx-2 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
        <span>Official ISO 9001:2015 Identification Reports</span>
        <span className="mx-2 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
        <span className="text-emerald-400">Free Pan-India Shipping</span>
        <span className="mx-2 text-stone-600 hidden sm:inline" aria-hidden="true">·</span>
        <span className="text-amber-200">COD ₹150 Available</span>
      </div>

      {/* Main Navigation - Strict Top Bar Contract: Zone 1, Zone 2, Zone 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single Brand Lockup with Official Crest Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('store');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <KanhaLogo size={42} showText={true} />
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-300">
          <a
            href="#catalog"
            onClick={(e) => {
              if (activeView === 'meta-hub') {
                e.preventDefault();
                setActiveView('store');
                setTimeout(() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            1-21 Mukhi Beads
          </a>

          <a
            href="#sip-plans"
            onClick={(e) => {
              if (activeView === 'meta-hub') {
                e.preventDefault();
                setActiveView('store');
                setTimeout(() => {
                  document.getElementById('sip-plans')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>आसान किस्तों में (Installments / SIP)</span>
          </a>

          <button
            onClick={onOpenAiChat}
            className="hover:text-amber-300 transition-colors whitespace-nowrap flex items-center gap-1.5 text-amber-300 cursor-pointer"
            title="AI ज्योतिषाचार्य: नाम न्यूमरोलॉजी, मोबाइल जांच, लो-शू ग्रिड"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI नियो ग्रिड व मोबाइल जांच</span>
          </button>

          <button
            onClick={onOpenAiCalling}
            className="hover:text-emerald-300 transition-colors whitespace-nowrap flex items-center gap-1.5 text-emerald-400 cursor-pointer"
            title="AI Voice Calling Consultation"
          >
            <AiCallingIcon size={16} />
            <span>AI Calling</span>
          </button>

          <a
            href="#video-gallery"
            onClick={(e) => {
              if (activeView === 'meta-hub') {
                e.preventDefault();
                setActiveView('store');
                setTimeout(() => {
                  document.getElementById('video-gallery')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
            className="hover:text-red-400 text-stone-300 transition-colors whitespace-nowrap flex items-center gap-1 font-medium"
            title="यूट्यूब वीडियो दर्शन: @kanhaasaastrorudraksha"
          >
            <YouTubeIcon size={16} className="text-red-500 fill-current" />
            <span>वीडियो दर्शन</span>
          </a>

          <a
            href="#authenticity"
            onClick={(e) => {
              if (activeView === 'meta-hub') {
                e.preventDefault();
                setActiveView('store');
                setTimeout(() => {
                  document.getElementById('authenticity')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
            className="hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            ISO Certificate
          </a>

          <button
            onClick={() => setActiveView(activeView === 'store' ? 'meta-hub' : 'store')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'meta-hub'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-amber-300 text-stone-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Meta Ads Hub</span>
          </button>
        </nav>

        {/* Zone 3: Primary action icons (AI Astrologer Query, AI Calling, WhatsApp, Cart) */}
        <div className="flex items-center gap-2">
          {/* AI Query Icon (Name Numerology, Mobile Check, Lo Shu Grid) */}
          <button
            onClick={onOpenAiChat}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            title="AI ज्योतिषी: नाम न्यूमरोलॉजी, मोबाइल नंबर जांच, लो-शू ग्रिड (क्रेडिट्स द्वारा)"
          >
            <KanhaAiChatIcon size={18} />
            <span className="hidden xl:inline text-[11px] font-bold">AI ज्योतिषी</span>
          </button>

          {/* AI Voice Call Icon */}
          <button
            onClick={onOpenAiCalling}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
            title="AI Voice Call Consultation"
          >
            <AiCallingIcon size={18} />
            <span className="hidden xl:inline text-[11px] font-bold">AI Call</span>
          </button>

          {/* Direct Phone Call Icon (No written phone text) */}
          <a
            href={`tel:${merchantPhone}`}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 transition-colors"
            title="कॉल करें (Direct Phone Call)"
          >
            <Phone className="w-4 h-4 text-amber-400" />
          </a>

          {/* Direct WhatsApp Icon (No written number text) */}
          <button
            onClick={handleDirectWhatsApp}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm cursor-pointer"
            title="व्हाट्सएप पर संपर्क करें (WhatsApp)"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {/* Official YouTube Channel Link */}
          <a
            href="https://www.youtube.com/@kanhaasaastrorudraksha"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 transition-all shadow-sm"
            title="YouTube चैनल: @kanhaasaastrorudraksha (वीडियो देखें)"
          >
            <YouTubeIcon size={16} className="fill-current" />
          </a>

          {/* Shopping Cart Icon */}
          <button
            onClick={onOpenCart}
            aria-label="Open Shopping Cart"
            className="relative p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-stone-950 bg-amber-400 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
