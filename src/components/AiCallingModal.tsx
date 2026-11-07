import React, { useState } from 'react';
import { PhoneCall, CheckCircle2, X, Loader2, Info } from 'lucide-react';
import { AiCallingIcon } from './AiIcons';
import { trackMetaEvent } from '../utils/metaTracker';
import { AstroWalletModal, WalletChip, useAstroWallet } from './AstroWallet';
import { requestAiCall, reasonText } from '../utils/kanhaApi';

interface AiCallingModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantPhone: string;
}

const TOPICS = [
  'Rudraksha Selection (1 to 21 Mukhi)',
  'Kundli / Rashi Guidance',
  'Lo Shu Grid & Numerology Remedies',
  'Certified Astrological Gemstone Prescription',
  'Siddh Mala & Puja Vidhi',
];

export const AiCallingModal: React.FC<AiCallingModalProps> = ({ isOpen, onClose }) => {
  const wallet = useAstroWallet();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ mode: string; minutes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletReason, setWalletReason] = useState<string | null>(null);

  if (!isOpen) return null;

  const canCall = !!wallet && (wallet.free_call_available || wallet.balance >= wallet.call_price_per_min * 2);

  const openWallet = (reason: string | null) => {
    setWalletReason(reason);
    setWalletOpen(true);
  };

  const handleCall = async () => {
    setError(null);
    if (!wallet) return openWallet('login_required');
    if (String(wallet.phone).startsWith('guest-')) return setError('AI कॉल अभी उपलब्ध नहीं है। कृपया चैट में सवाल पूछें।');
    if (!canCall) return openWallet('need_credits');
    setBusy(true);
    const r = await requestAiCall(topic);
    setBusy(false);
    if (r.ok) {
      setResult({ mode: r.mode, minutes: r.allowed_minutes });
      trackMetaEvent('Lead', { lead_type: 'ai_outbound_call_requested', topic, mode: r.mode });
    } else if (r.reason === 'need_credits' || r.reason === 'login_required') {
      openWallet(r.reason);
    } else {
      setError(reasonText(r.reason));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100">
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AiCallingIcon size={40} />
            <div>
              <h3 className="text-sm font-bold text-white">Kanha AI Voice Astrologer</h3>
              <p className="text-[13px] text-stone-400">AI आपके फोन पर कॉल करेगा · हिंदी / English</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <WalletChip wallet={wallet} onClick={() => openWallet(null)} />
            <button onClick={onClose} aria-label="Close" className="p-1 text-stone-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[80vh]">
          {result ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">कॉल लग रही है!</h4>
              <p className="text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
                1-2 मिनट में <strong className="text-white">+91 80715 83520</strong> से आपके नंबर
                <strong className="text-white font-mono"> +{wallet?.phone}</strong> पर कॉल आएगी। कृपया कॉल उठाएँ।
              </p>
              <p className="text-xs text-amber-300">
                {result.mode === 'free'
                  ? 'यह आपकी फ्री कॉल है — पहला 1 मिनट फ्री, उसके बाद ₹20/मिनट बैलेंस से कटेगा।'
                  : `₹20/मिनट — आपके बैलेंस से लगभग ${result.minutes} मिनट बात हो सकती है।`}
              </p>
              <button onClick={() => setResult(null)} className="text-xs text-amber-400 hover:underline cursor-pointer">
                वापस जाएँ
              </button>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1.5 text-sm">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <AiCallingIcon size={16} /> AI ज्योतिषी से फोन पर बात करें
                </p>
                <ul className="text-xs text-stone-300 space-y-1 list-disc pl-4">
                  <li>पहली कॉल का पहला 1 मिनट फ्री</li>
                  <li>उसके बाद ₹20 प्रति मिनट (क्रेडिट्स से)</li>
                  <li>कॉल का समय: सुबह 9 से रात 9 बजे तक</li>
                </ul>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">किस बारे में बात करनी है?</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {wallet && !canCall && (
                <div className="p-3 bg-amber-950/60 border border-amber-500 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-2">
                  <span>कॉल के लिए कम से कम ₹40 बैलेंस चाहिए (2 मिनट)।</span>
                  <button onClick={() => openWallet('need_credits')} className="px-3 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-lg cursor-pointer whitespace-nowrap">
                    रिचार्ज करें
                  </button>
                </div>
              )}

              <button
                onClick={handleCall}
                disabled={busy}
                className="w-full py-3.5 px-4 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
                {!wallet
                  ? 'लॉगिन करके कॉल पाएँ'
                  : wallet.free_call_available
                    ? 'फ्री AI कॉल पाएँ (1 मिनट फ्री)'
                    : 'मुझे AI कॉल करें (₹20/मिनट)'}
              </button>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <p className="text-[12px] text-stone-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                कॉल खत्म होने पर जितने मिनट बात हुई उतना ही बैलेंस कटता है (हर शुरू हुआ मिनट पूरा गिना जाता है)।
              </p>
            </>
          )}
        </div>
      </div>
      <AstroWalletModal isOpen={walletOpen} reason={walletReason} onClose={() => setWalletOpen(false)} />
    </div>
  );
};
