import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Coins, Loader2, CheckCircle2, LogOut } from 'lucide-react';
import {
  Wallet,
  CREDIT_PACKS,
  getWallet,
  subscribeWallet,
  refreshWallet,
  getToken,
  sendOtp,
  verifyOtp,
  buyCredits,
  logout,
  reasonText,
} from '../utils/kanhaApi';

export function useAstroWallet() {
  const [wallet, setW] = useState<Wallet | null>(getWallet());
  useEffect(() => {
    const unsub = subscribeWallet(setW);
    if (!getWallet() && getToken()) refreshWallet();
    return () => {
      unsub();
    };
  }, []);
  return wallet;
}

export const WalletChip: React.FC<{ wallet: Wallet | null; onClick: () => void }> = ({ wallet, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-600/70 rounded-full text-xs text-amber-300 font-semibold hover:bg-amber-900/60 transition-colors cursor-pointer"
    title={wallet ? 'Recharge credits' : 'Login'}
  >
    <Coins className="w-3.5 h-3.5 text-amber-400" />
    {wallet ? (
      <span className="tabular-nums">
        ₹{wallet.balance} क्रेडिट{wallet.free_questions_left > 0 ? ` · ${wallet.free_questions_left} फ्री सवाल` : ''}
      </span>
    ) : (
      <span>लॉगिन करें</span>
    )}
  </button>
);

const LoginForm: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (phone.replace(/\D/g, '').length < 10) return setError(reasonText('invalid_phone'));
    setBusy(true);
    const r = await sendOtp(phone);
    setBusy(false);
    if (r.ok) setStep('otp');
    else setError(reasonText(r.reason));
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const r = await verifyOtp(phone, code, name);
    setBusy(false);
    if (r.ok) onDone();
    else setError(reasonText(r.reason));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-white">मोबाइल नंबर से लॉगिन करें</h4>
        <p className="text-xs text-stone-400 mt-1">
          पहले 3 सवाल फ्री और पहली AI कॉल का 1 मिनट फ्री। OTP आपके WhatsApp पर आएगा।
        </p>
      </div>
      {step === 'phone' ? (
        <form onSubmit={submitPhone} className="space-y-3">
          <input
            type="text"
            placeholder="आपका नाम"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-amber-400"
          />
          <input
            type="tel"
            required
            inputMode="numeric"
            placeholder="10 अंकों का WhatsApp नंबर"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            WhatsApp पर OTP भेजें
          </button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="space-y-3">
          <p className="text-xs text-stone-300">
            +91 {phone.replace(/\D/g, '').slice(-10)} पर WhatsApp में आया 6 अंकों का OTP डालें।
          </p>
          <input
            type="text"
            required
            inputMode="numeric"
            maxLength={6}
            placeholder="OTP"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-lg tracking-[0.4em] text-center text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            वेरीफाई करें
          </button>
          <button type="button" onClick={() => setStep('phone')} className="w-full text-xs text-amber-400 hover:underline cursor-pointer">
            नंबर बदलें / OTP दोबारा भेजें
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-[12px] text-stone-500 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> आपका नंबर किसी और के साथ साझा नहीं किया जाता।
      </p>
    </div>
  );
};

const RechargePanel: React.FC<{ wallet: Wallet; reason?: string | null; onDone: () => void }> = ({ wallet, reason, onDone }) => {
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const buy = async (price: number) => {
    setMsg(null);
    setBusy(price);
    const r = await buyCredits(price);
    setBusy(null);
    if (r.ok) {
      setMsg({ ok: true, text: r.duplicate ? 'यह पेमेंट पहले ही जुड़ चुका है।' : `₹${price} का पेमेंट मिला, ${r.added} क्रेडिट्स जुड़ गए! 🙏` });
      setTimeout(onDone, 1500);
    } else if (r.reason !== 'dismissed') {
      setMsg({ ok: false, text: r.reason === 'payment_failed' ? 'पेमेंट पूरा नहीं हुआ। कृपया दोबारा कोशिश करें।' : reasonText(r.reason) });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold text-white">क्रेडिट्स रिचार्ज करें</h4>
        {reason && <p className="text-xs text-amber-300 mt-1">{reasonText(reason)}</p>}
        <p className="text-xs text-stone-400 mt-1">
          आपका बैलेंस: <strong className="text-white">₹{wallet.balance}</strong> · हर सवाल ₹{wallet.chat_price} · AI कॉल ₹{wallet.call_price_per_min}/मिनट
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {CREDIT_PACKS.map((p) => (
          <button
            key={p.price}
            onClick={() => buy(p.price)}
            disabled={busy !== null}
            className={`p-3 rounded-xl text-left border transition-colors cursor-pointer disabled:opacity-60 ${
              p.popular ? 'border-amber-500 bg-amber-950/40' : 'border-stone-700 bg-stone-950 hover:border-amber-500'
            }`}
          >
            {p.popular && <span className="text-[11px] font-bold text-amber-400 uppercase">सबसे लोकप्रिय</span>}
            <p className="text-lg font-bold text-white">₹{p.price}</p>
            <p className="text-xs text-emerald-400 font-semibold">{p.credits} क्रेडिट्स</p>
            <p className="text-[12px] text-stone-400 mt-0.5">{p.note}</p>
            {busy === p.price && <Loader2 className="w-4 h-4 animate-spin text-amber-400 mt-1" />}
          </button>
        ))}
      </div>
      {msg && (
        <p className={`text-xs flex items-center gap-1.5 ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
          {msg.ok && <CheckCircle2 className="w-4 h-4" />} {msg.text}
        </p>
      )}
      <div className="flex items-center justify-between text-[12px] text-stone-500">
        <span>Razorpay से सुरक्षित पेमेंट (UPI, Card, NetBanking)</span>
        <button onClick={() => { logout(); onDone(); }} className="flex items-center gap-1 hover:text-stone-300 cursor-pointer">
          <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>
    </div>
  );
};

export const AstroWalletModal: React.FC<{ isOpen: boolean; reason?: string | null; onClose: () => void }> = ({ isOpen, reason, onClose }) => {
  const wallet = useAstroWallet();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 p-1 text-stone-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        {wallet ? <RechargePanel wallet={wallet} reason={reason} onDone={onClose} /> : <LoginForm onDone={onClose} />}
      </div>
    </div>
  );
};
