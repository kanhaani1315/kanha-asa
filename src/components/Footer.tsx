import React from 'react';
import { ShieldCheck, MessageCircle, MapPin, Phone, Mail, Award, PhoneCall, Bot, Globe, Play, ExternalLink } from 'lucide-react';
import { KanhaLogo } from './KanhaLogo';
import { AiCallingIcon, KanhaAiChatIcon } from './AiIcons';
import { YouTubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenMetaHub: () => void;
  onOpenAiChat: () => void;
  onOpenAiCalling: () => void;
  merchantPhone: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenMetaHub,
  onOpenAiChat,
  onOpenAiCalling,
  merchantPhone,
}) => {
  const handleWhatsApp = () => {
    const url = generateWhatsAppUrl(
      merchantPhone,
      'Pranam Kanha Asa! 🕉️ I want guidance on ordering energized 1 to 21 Mukhi Nepali Rudraksha beads from www.kanhaasa.com.'
    );
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Lineage & Official Socials */}
          <div className="space-y-3">
            <KanhaLogo size={52} showText={true} />
            <p className="text-stone-400 text-xs leading-relaxed mt-2">
              Dedicated to authentic Himalayan Nepali 1 to 21 Mukhi Rudrakshas, Sarva Siddh Malas, and Vedic Jyotish remedies. Certified ISO 9001:2015 with X-Ray lab reports.
            </p>
            <div className="pt-1 flex items-center gap-2 text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official Kanha Asa ISO 9001:2015 Reports</span>
            </div>

            {/* Official Social Links (YouTube, Instagram, Facebook) */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-2">
                Official Channels & Video Darshan:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.youtube.com/@kanhaasaastrorudraksha"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/40 transition-all"
                  title="YouTube Channel (@kanhaasaastrorudraksha)"
                >
                  <YouTubeIcon size={18} className="fill-current" />
                </a>

                <a
                  href="https://www.instagram.com/kanha.asa/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/40 transition-all"
                  title="Instagram Official (@kanha.asa)"
                >
                  <InstagramIcon size={18} className="fill-current" />
                </a>

                <a
                  href="https://www.facebook.com/KanhaASA"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 transition-all"
                  title="Facebook Official (@KanhaASA)"
                >
                  <FacebookIcon size={18} className="fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: 1-21 Mukhi & SIP Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Sacred Collections & SIP
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  1 to 21 Mukhi Nepali Rudrakshas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sip-plans')}
                  className="text-amber-300 hover:text-amber-200 transition-colors text-left font-medium cursor-pointer"
                >
                  आसान किस्तों में रुद्राक्ष बुक करें (Installments / SIP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Sarva Siddh & 108 Japa Malas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Gauri Shankar & South Dana 1 Mukhi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Certified Natural Gemstones (Moonga, Pukhraj)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Astrologer & Calling */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              AI Astrologer & Calling
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={onOpenAiChat}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <KanhaAiChatIcon size={16} />
                  <span>AI Acharya (Lo Shu & Numerology)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAiCalling}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <AiCallingIcon size={16} />
                  <span>AI Voice Call Consultation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('video-gallery')}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer font-medium"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>यूट्यूब वीडियो दर्शन (@kanhaasaastrorudraksha)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('astro-kundli')}
                  className="hover:text-stone-300 transition-colors text-left cursor-pointer"
                >
                  Vedic Horoscope & Janam Kundli
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMetaHub}
                  className="hover:text-stone-300 transition-colors text-left cursor-pointer"
                >
                  Meta Ads Lead & Zapier Webhook CRM
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Helpline & Official Store
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-mono font-bold">+91 {merchantPhone}</p>
                  <p className="text-[11px] text-stone-500">Official Calling & WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="http://www.kanhaasa.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:underline font-mono font-semibold"
                  >
                    www.kanhaasa.com
                  </a>
                  <p className="text-[11px] text-stone-500">Official Web Store</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-stone-300">
                  <p className="font-semibold text-white">KANHA ASA (Kanha Rudraksha Kendra)</p>
                  <p>Shop No. BF3/3, Ground Floor, B-Block, Shilpi Plaza, (Above Axis Bank, Near Sai Computer), Shilpi Plaza Road, Rewa, Madhya Pradesh – 486001</p>
                  <a
                    href="https://maps.google.com/?q=Kanha+Asa+Shop+No+BF3/3+Shilpi+Plaza+Rewa+Madhya+Pradesh+486001"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 underline mt-1 font-sans"
                  >
                    📍 Google मैप्स पर देखें (Open in Google Maps)
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>support@kanhaasa.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Official Social Media Community Hub Strip */}
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Play className="w-5 h-5 fill-current text-red-500" />
            </div>
            <div>
              <p className="text-white font-bold text-xs">कान्हा असा ऑफिशियल सोशल मीडिया एवं वीडियो दर्शन</p>
              <p className="text-[11px] text-stone-400">असली 1 से 21 मुखी रुद्राक्ष पहचान, वैदिक पूजन व लाइव कस्टमर वीडियो देखें</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="https://www.youtube.com/@kanhaasaastrorudraksha"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow transition-colors"
            >
              <YouTubeIcon size={16} className="fill-current text-white" />
              <span>YouTube @kanhaasaastrorudraksha</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <a
              href="https://www.instagram.com/kanha.asa/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-semibold text-xs shadow transition-opacity"
            >
              <InstagramIcon size={15} className="fill-current text-white" />
              <span>Instagram @kanha.asa</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <a
              href="https://www.facebook.com/KanhaASA"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow transition-colors"
            >
              <FacebookIcon size={15} className="fill-current text-white" />
              <span>Facebook @KanhaASA</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Kanha Asa Astro & Rudraksha (kanhaasa.com) · ISO 9001:2015. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">Free Pan-India Shipping</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-300">COD ₹150 Handling</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300 font-mono">10% Code: KANHA10</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

