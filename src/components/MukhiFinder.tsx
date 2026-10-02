import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2, ShieldAlert, Award, Tag, Copy, Check } from 'lucide-react';
import { Lead, Product } from '../types';
import { MUKHI_RECOMMENDATION_MATRIX, PRODUCTS } from '../data/mockData';
import { trackMetaEvent } from '../utils/metaTracker';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface MukhiFinderProps {
  onLeadCaptured: (lead: Lead) => void;
  onSelectProduct: (product: Product) => void;
  merchantPhone: string;
}

export const MukhiFinder: React.FC<MukhiFinderProps> = ({
  onLeadCaptured,
  onSelectProduct,
  merchantPhone,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedConcern, setSelectedConcern] = useState<string>('career');
  const [dob, setDob] = useState<string>('1990-01-01');
  const [rashi, setRashi] = useState<string>('Mesh (Aries)');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const concernsList = [
    { id: 'career', title: 'Wealth, Career & Debt Relief', desc: 'Financial blockages, promotion delays, business expansion' },
    { id: 'marriage', title: 'Marriage & Relationship Harmony', desc: 'Marital conflict, delay in matrimony, partner compatibility' },
    { id: 'health', title: 'Health, Blood Pressure & Anxiety', desc: 'Mental restlessness, heart health, chronic stress relief' },
    { id: 'protection', title: 'Protection & Shani Sade Sati', desc: 'Negative energies, evil eye (Buri Nazar), Rahu-Ketu dosha' },
    { id: 'spiritual', title: 'Spiritual Awakening & Meditation', desc: 'Chakra alignment, higher consciousness, Shiva bhakti' },
  ];

  const rashisList = [
    'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
    'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)'
  ];

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.length < 2) {
      setError('Please enter your full name');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp phone number');
      return;
    }

    setError('');

    // Generate Vedic Recommendation
    const recData = MUKHI_RECOMMENDATION_MATRIX[selectedConcern] || MUKHI_RECOMMENDATION_MATRIX['career'];
    const matchedProduct = PRODUCTS.find(p => p.id === recData.recommendedProductId) || PRODUCTS[0];
    setRecommendation({ ...recData, product: matchedProduct });

    // 1. Create Lead Record with Unlocked 10% Coupon KANHA10
    const newLead: Lead = {
      id: `lead-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Unspecified',
      concern: concernsList.find(c => c.id === selectedConcern)?.title || selectedConcern,
      birthDate: dob,
      rashi: rashi,
      productInterest: recData.mukhi,
      utmSource: 'meta_rudraksha_lead_form',
      utmMedium: 'funnel',
      utmCampaign: 'mukhi_recommendation_calculator',
      createdAt: new Date().toLocaleString(),
      status: 'new',
      unlockedCoupon: 'KANHA10',
      notes: `Zodiac: ${rashi}, DOB: ${dob}. Recommended: ${recData.mukhi}. Coupon: KANHA10 unlocked.`
    };

    // 2. Dispatch Meta "Lead" Event
    trackMetaEvent('Lead', {
      lead_id: newLead.id,
      content_name: 'Mukhi Recommendation Lead Magnet',
      customer_name: newLead.name,
      customer_phone: newLead.phone,
      concern: newLead.concern,
      rashi: newLead.rashi,
      coupon_unlocked: 'KANHA10',
      value: matchedProduct.price,
      currency: 'INR'
    });

    onLeadCaptured(newLead);
    setStep(4);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('KANHA10');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleWhatsAppConsult = () => {
    trackMetaEvent('Contact', {
      action: 'recommendation_whatsapp_direct',
      lead_name: name,
      product: recommendation?.mukhi
    });

    const msg = `*Pranam Acharya Ji!* 🕉️
I used the Kanha Asa Recommendation Engine:
*Name:* ${name}
*My Life Focus:* ${concernsList.find(c => c.id === selectedConcern)?.title}
*Date of Birth:* ${dob} (${rashi})
*Recommended Mukhi:* ${recommendation?.mukhi}
*Coupon Code:* KANHA10 (10% Discount Claimed)

Please guide me with the wearing rituals and energized silver capping pricing.`;

    const url = generateWhatsAppUrl(merchantPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <section id="mukhi-finder" className="py-16 sm:py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Vedic Horoscope & Mukhi Matcher</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white" style={{ textWrap: 'balance' }}>
            Find Your Astrologically Recommended Rudraksha
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
            Answer 3 simple questions to receive your tailored Vedic recommendation and unlock an instant 10% coupon code: <strong className="text-amber-400 font-mono">KANHA10</strong>.
          </p>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 px-2 max-w-md mx-auto">
            <div className={`flex items-center gap-2 text-xs font-medium ${step >= 1 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>1</span>
              <span>Life Focus</span>
            </div>
            <div className="h-0.5 w-8 bg-stone-800" />
            <div className={`flex items-center gap-2 text-xs font-medium ${step >= 2 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>2</span>
              <span>Birth Details</span>
            </div>
            <div className="h-0.5 w-8 bg-stone-800" />
            <div className={`flex items-center gap-2 text-xs font-medium ${step >= 3 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>3</span>
              <span>10% Coupon & Report</span>
            </div>
          </div>
        )}

        {/* Funnel Box */}
        <div className="bg-stone-950/80 border border-stone-800 rounded-lg p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          {/* STEP 1: Choose Concern */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-stone-200">
                What area of life requires the strongest energetic breakthrough right now?
              </h3>
              <div className="space-y-3">
                {concernsList.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => setSelectedConcern(item.id)}
                    className={`block p-4 rounded-md border transition-all cursor-pointer ${
                      selectedConcern === item.id
                        ? 'border-amber-500/80 bg-amber-950/20'
                        : 'border-stone-800 bg-stone-900/60 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-stone-100">{item.title}</p>
                        <p className="text-xs text-stone-400 mt-1">{item.desc}</p>
                      </div>
                      <input
                        type="radio"
                        name="concern"
                        checked={selectedConcern === item.id}
                        onChange={() => setSelectedConcern(item.id)}
                        className="mt-1 accent-amber-500"
                      />
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Next: Astrological Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Birth Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-stone-200">
                Your Birth Date & Zodiac (Rashi) for Planetary Alignment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Rashi / Moon Sign (If known)
                  </label>
                  <select
                    value={rashi}
                    onChange={(e) => setRashi(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    {rashisList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="Not Sure">Don't Know My Rashi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Next: Unlock 10% Coupon</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Lead Form & 10% Coupon Unlock */}
          {step === 3 && (
            <form onSubmit={handleSubmitLead} className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-stone-200">
                  Fill Details to Unlock 10% Discount Code & Vedic Prescription
                </h3>
                <p className="text-xs text-emerald-400 mt-1">
                  🎁 You will immediately receive 10% Coupon Code (KANHA10) + Free Express Shipping!
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 91318 05622"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-md text-sm text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors whitespace-nowrap shadow-md cursor-pointer"
                >
                  <span>Unlock Recommendation & 10% Code</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Recommendation + Coupon Code Display */}
          {step === 4 && recommendation && (
            <div className="space-y-6">
              {/* Coupon Unlocked Banner */}
              <div className="p-4 bg-emerald-950/70 border border-emerald-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">
                      10% DISCOUNT COUPON UNLOCKED!
                    </p>
                    <p className="text-[11px] text-stone-300">
                      Use code at checkout for 10% discount across 1 to 21 Mukhi beads.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-stone-950 border border-amber-500 text-amber-300 font-mono font-bold text-sm rounded">
                    KANHA10
                  </span>
                  <button
                    onClick={handleCopyCoupon}
                    className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCoupon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoupon ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Prescription Card */}
              <div className="border border-amber-900/50 bg-amber-950/10 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Primary Vedic Prescription</span>
                    <h3 className="text-xl font-bold font-display text-white mt-0.5">{recommendation.mukhi}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400">Ruling Deity</span>
                    <p className="text-xs font-semibold text-amber-200">{recommendation.deity}</p>
                  </div>
                </div>

                <p className="text-sm text-stone-300 leading-relaxed font-sans">
                  {recommendation.reason}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2 border-t border-amber-900/20">
                  <span>Ruling Planet: <strong className="text-stone-200">{recommendation.planet}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Origin: <strong className="text-stone-200">Nepal (Himalayas)</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Lab Certificate: <strong className="text-emerald-400">Kanha Asa ISO 9001:2015 Included</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Shipping: <strong className="text-emerald-400">FREE Pan-India</strong></span>
                </div>
              </div>

              {/* Matched Product CTA */}
              {recommendation.product && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-stone-900 border border-stone-800 rounded-lg">
                  <img
                    src={recommendation.product.image}
                    alt={recommendation.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-md border border-stone-800 shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-xs text-amber-400 font-medium">{recommendation.product.hindiName}</p>
                    <h4 className="text-base font-semibold text-white">{recommendation.product.name}</h4>
                    <p className="text-sm font-semibold text-stone-200 tabular-nums mt-0.5">
                      ₹{recommendation.product.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs line-through text-stone-500 font-normal">
                        ₹{recommendation.product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectProduct(recommendation.product)}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Details & Certificate
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleWhatsAppConsult}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Report & Chat on WhatsApp (+91 9131805622)</span>
                </button>

                <button
                  onClick={() => {
                    setStep(1);
                    setRecommendation(null);
                  }}
                  className="px-4 py-3 text-xs font-medium rounded-md bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors cursor-pointer"
                >
                  Calculate for Another Family Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
