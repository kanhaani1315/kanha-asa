import React, { useState } from 'react';
import { ASTROLOGY_IMAGE } from '../data/mockData';
import { MessageCircle, CheckCircle2, Star, Calendar, Clock, MapPin, Sparkles, Tag, PhoneCall } from 'lucide-react';
import { AiCallingIcon } from './AiIcons';
import { Lead } from '../types';
import { trackMetaEvent } from '../utils/metaTracker';
import { generateWhatsAppUrl, createConsultationMessage } from '../utils/whatsapp';

interface AstroConsultationProps {
  onLeadCaptured: (lead: Lead) => void;
  merchantPhone: string;
  onOpenAiCalling: () => void;
}

export const AstroConsultation: React.FC<AstroConsultationProps> = ({
  onLeadCaptured,
  merchantPhone,
  onOpenAiCalling,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [dob, setDob] = useState('1992-05-18');
  const [birthTime, setBirthTime] = useState('10:30');
  const [birthPlace, setBirthPlace] = useState('');
  const [concern, setConcern] = useState('Career, Promotion & Business Financial Growth');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please provide a valid 10-digit WhatsApp number');
      return;
    }

    setError('');

    const newLead: Lead = {
      id: `lead-astro-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim() || birthPlace.trim() || 'India',
      concern: `Kundli Consultation: ${concern}`,
      birthDate: `${dob} ${birthTime}`,
      productInterest: 'Vedic Kundli Consultation & 1-21 Mukhi Prescription',
      utmSource: 'website_astro_booking',
      utmMedium: 'direct_form',
      utmCampaign: 'kundli_astro_consult',
      createdAt: new Date().toLocaleString(),
      status: 'new',
      unlockedCoupon: 'KANHA10',
      notes: `Birth Place: ${birthPlace}, Time: ${birthTime}, Focus: ${concern}. Unlocked coupon KANHA10.`
    };

    trackMetaEvent('Lead', {
      lead_id: newLead.id,
      content_name: 'Vedic Astrology Consultation Booking',
      name: newLead.name,
      phone: newLead.phone,
      concern: newLead.concern,
      coupon_unlocked: 'KANHA10',
      value: 1100,
      currency: 'INR'
    });

    onLeadCaptured(newLead);
    setSubmitted(true);
  };

  const handleOpenWhatsApp = () => {
    trackMetaEvent('Contact', {
      action: 'astro_booking_whatsapp_followup',
      lead_name: name
    });
    const msg = createConsultationMessage(name, concern, `${dob} at ${birthTime} (${birthPlace})`);
    const finalMsg = `${msg}\n*Claimed Coupon:* KANHA10 (10% Discount)`;
    const url = generateWhatsAppUrl(merchantPhone, finalMsg);
    window.open(url, '_blank');
  };

  return (
    <section id="astro-kundli" className="py-16 sm:py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Vedic Astrological Context & Image (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Vedic Jyotish & 1 to 21 Mukhi Science</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white" style={{ textWrap: 'balance' }}>
              Personalized Kundli & Planetary Rudraksha Prescription
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
              Every person is born under unique Nakshatra constellations and planetary transits. Wearing the wrong Mukhi or unenergized bead can be ineffective. Our learned Acharyas analyze your Janam Kundli to prescribe the exact 1 to 21 Mukhi combinations and Vedic Beej Mantras.
            </p>

            {/* Visual Image Asset */}
            <div className="relative rounded-lg overflow-hidden border border-stone-800 shadow-xl aspect-[16/9]">
              <img
                src={ASTROLOGY_IMAGE}
                alt="Vedic Astrology Consultation with Kundli and Rudraksha"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-stone-300 bg-stone-950/80 backdrop-blur-sm p-2 rounded">
                <span>Vedic Consultation & Live Support</span>
                <button
                  type="button"
                  onClick={onOpenAiCalling}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <AiCallingIcon size={16} />
                  <span>AI Voice Call (AI Calls You)</span>
                </button>
              </div>
            </div>

            {/* Adjacency Proof Checklist */}
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Identification of weak, combust (Asta), or afflicted (Neecha) planets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Detection of Shani Sade Sati, Manglik Dosha, or Kaal Sarp Dosha</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Silver or Panchdhatu energization according to your Gotra</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Capture Booking Form (6 cols) */}
          <div className="lg:col-span-6 bg-stone-950 border border-stone-800 rounded-xl p-6 sm:p-8 shadow-2xl">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    Book Astrological Consultation
                  </h3>
                  <p className="text-xs text-emerald-400 mt-1">
                    Fill your birth coordinates to unlock 10% coupon code <strong className="font-mono">KANHA10</strong> & connect on WhatsApp.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 91318 05622"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Place of Birth (City, State)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur, Rajasthan"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Time of Birth (Approx)
                      </label>
                      <input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Primary Question / Life Focus
                    </label>
                    <select
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Career, Promotion & Business Financial Growth">Career, Promotion & Business Financial Growth</option>
                      <option value="Marriage Delay, Matchmaking & Relationship Discord">Marriage Delay, Matchmaking & Relationship Discord</option>
                      <option value="Health, Mental Peace & Chronic Stress">Health, Mental Peace & Chronic Stress</option>
                      <option value="Shani Sade Sati, Rahu Mahadasha & Evil Eye">Shani Sade Sati, Rahu Mahadasha & Evil Eye</option>
                      <option value="General Kundli Analysis & Lucky Rudraksha">General Kundli Analysis & Lucky Rudraksha</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-md cursor-pointer"
                  >
                    <span>Request WhatsApp Consultation (+ Unlock 10% Code)</span>
                  </button>
                  <p className="text-[11px] text-stone-500 text-center mt-2">
                    Complimentary initial assessment by Kanha Asa Astrologers.
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-4">
                <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-700 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    Consultation Request Registered!
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    Pranam {name} ji, our Vedic Astrologer has received your details for "{concern}".
                  </p>
                </div>

                {/* Coupon Code Callout */}
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded-lg text-xs text-emerald-300 font-mono">
                  🎁 Unlocked Coupon: <strong>KANHA10</strong> (10% OFF on all 1 to 21 Mukhi orders)
                </div>

                <div className="p-4 bg-stone-900 border border-stone-800 rounded-lg text-left text-xs space-y-1.5 text-stone-300">
                  <div>Name: <strong>{name}</strong></div>
                  <div>WhatsApp: <strong>{phone}</strong></div>
                  <div>Coordinates: <strong>{dob} ({birthTime}), {birthPlace || 'India'}</strong></div>
                  <div>Status: <span className="text-amber-400 font-semibold">Priority In-Queue</span></div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp with Pandit Ji</span>
                  </button>

                  <button
                    onClick={onOpenAiCalling}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-md bg-stone-900 hover:bg-stone-800 text-emerald-300 border border-emerald-900/60 transition-colors cursor-pointer"
                  >
                    <AiCallingIcon size={16} />
                    <span>AI Voice Consultation (AI Calls You)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
