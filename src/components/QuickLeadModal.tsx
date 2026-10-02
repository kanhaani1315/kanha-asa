import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Tag, Percent, ArrowRight } from 'lucide-react';
import { Lead } from '../types';
import { trackMetaEvent } from '../utils/metaTracker';

interface QuickLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: (lead: Lead) => void;
  merchantPhone: string;
}

export const QuickLeadModal: React.FC<QuickLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [concern, setConcern] = useState('Career & Wealth Growth');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');

    const newLead: Lead = {
      id: `lead-voucher-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone.trim(),
      concern: `Voucher Claimed: ${concern}`,
      utmSource: 'popup_discount_voucher',
      utmMedium: 'modal',
      utmCampaign: 'tier_discount_10_15_25',
      createdAt: new Date().toLocaleString(),
      status: 'new',
      unlockedCoupon: 'KANHA10',
      notes: 'Unlocked 10%, 15%, and 25% Discount Vouchers'
    };

    trackMetaEvent('Lead', {
      lead_id: newLead.id,
      content_name: '3-Tier Discount Voucher Claimed',
      name: newLead.name,
      phone: newLead.phone,
      concern: newLead.concern,
      currency: 'INR'
    });

    onLeadCaptured(newLead);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/60 rounded-xl p-6 sm:p-7 shadow-2xl text-stone-100">
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-950/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kanha Asa Sacred Blessings</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Unlock 10%, 15% & 25% Vouchers
              </h3>
              <p className="text-xs text-stone-400">
                Claim your exclusive discount codes for 1 to 21 Mukhi Rudrakshas and certified gemstones on www.kanhaasa.com.
              </p>
            </div>

            {/* 3 Tier Explanation in Voucher Modal */}
            <div className="space-y-2 p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs">
              <div className="flex justify-between items-center text-stone-300">
                <span>Orders under ₹10,000:</span>
                <span className="font-bold text-amber-400 font-mono">10% OFF (KANHA10)</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Orders above ₹10,000:</span>
                <span className="font-bold text-emerald-400 font-mono">15% OFF (KANHA15)</span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>Orders of ₹1 Lakh & above:</span>
                <span className="font-bold text-amber-300 font-mono">25% OFF (KANHA25)</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Varma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 91318 05622"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Primary Spiritual Concern
                </label>
                <select
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Career & Wealth Growth">Career & Wealth Growth</option>
                  <option value="Marriage & Relationship Harmony">Marriage & Relationship Harmony</option>
                  <option value="Health & Stress Relief">Health & Stress Relief</option>
                  <option value="Shani Sade Sati Protection">Shani Sade Sati Protection</option>
                  <option value="Spiritual Sadhana">Spiritual Sadhana</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-md mt-2 cursor-pointer"
            >
              Unlock Discount Vouchers Now
            </button>
          </form>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-950/80 border border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Vouchers Activated for {name}!
            </h3>
            <p className="text-xs text-stone-300 max-w-xs mx-auto">
              Your discount codes are active and will automatically apply in your cart when you shop online on www.kanhaasa.com:
            </p>

            <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs space-y-1 font-mono text-left">
              <div className="text-amber-400 font-bold">• KANHA10 (10% OFF &lt; ₹10k)</div>
              <div className="text-emerald-400 font-bold">• KANHA15 (15% OFF &gt; ₹10k)</div>
              <div className="text-amber-300 font-bold">• KANHA25 (25% OFF &gt; ₹1 Lakh)</div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow cursor-pointer"
            >
              Start Shopping Online on www.kanhaasa.com
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
