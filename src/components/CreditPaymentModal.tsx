import React, { useState } from 'react';
import { Coins, CheckCircle2, QrCode, MessageCircle, Copy, ArrowRight, X, Sparkles, ShieldCheck, HelpCircle, Zap, CreditCard } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { trackMetaEvent } from '../utils/metaTracker';
import { openRazorpayCheckout } from '../utils/razorpay';

interface CreditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCredits: (credits: number, amount: number) => void;
  merchantPhone: string;
}

export const CreditPaymentModal: React.FC<CreditPaymentModalProps> = ({
  isOpen,
  onClose,
  onAddCredits,
  merchantPhone,
}) => {
  const [selectedPack, setSelectedPack] = useState<{ id: string; name: string; credits: number; price: number; badge?: string }>({
    id: 'pack-2',
    name: '15 Questions Recommended Pack',
    credits: 15,
    price: 49,
    badge: 'सर्वाधिक लोकप्रिय (Most Popular)'
  });

  const [paymentStep, setPaymentStep] = useState<'select' | 'pay' | 'success'>('select');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showOwnerGuide, setShowOwnerGuide] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  if (!isOpen) return null;

  const packs = [
    {
      id: 'pack-1',
      name: '5 Questions Starter Pack',
      credits: 5,
      price: 19,
      desc: 'त्वरित रुद्राक्ष व रत्न चयन'
    },
    {
      id: 'pack-2',
      name: '15 Questions Super Pack',
      credits: 15,
      price: 49,
      badge: 'सर्वाधिक लोकप्रिय (Most Popular)',
      desc: 'लो-शू ग्रिड, नाम न्यूमरोलॉजी व मोबाइल जांच'
    },
    {
      id: 'pack-3',
      name: '35 Questions VIP Jyotish',
      credits: 35,
      price: 99,
      desc: 'परिवार के सदस्यों की कुंडली एवं विस्तृत परामर्श'
    },
    {
      id: 'pack-4',
      name: '100 Questions Unlimited Year',
      credits: 100,
      price: 199,
      desc: 'पूरे साल का महादशा, गोचर व ग्रह शांति विश्लेषण'
    }
  ];

  const upiId = `${merchantPhone}@okaxis`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = (paymentId?: string) => {
    trackMetaEvent('Purchase', {
      content_name: `AI Consultation Credits - ${selectedPack.name}`,
      value: selectedPack.price,
      currency: 'INR',
      credits: selectedPack.credits,
      payment_id: paymentId || 'manual_upi'
    });

    onAddCredits(selectedPack.credits, selectedPack.price);
    setPaymentStep('success');
    setTimeout(() => {
      setPaymentStep('select');
      onClose();
    }, 2200);
  };

  const handlePayWithRazorpay = () => {
    openRazorpayCheckout({
      amount: selectedPack.price,
      name: `Kanha Asa - ${selectedPack.credits} AI Credits`,
      description: `${selectedPack.credits} Consultation Credits Recharge (₹${selectedPack.price})`,
      customerPhone: userPhone.trim() || undefined,
      notes: {
        credits: String(selectedPack.credits),
        pack_name: selectedPack.name,
        merchant_store: 'kanhaasa.com'
      },
      onSuccess: (paymentId: string) => {
        setLastPaymentId(paymentId);
        handleCompletePayment(paymentId);
      },
      onFailure: (err: any) => {
        console.warn('Razorpay checkout closed or failed:', err);
        setPaymentStep('pay');
      }
    });
  };

  const handleSendWhatsAppProof = () => {
    const msg = `Pranam Acharya Ji! 🕉️\nI want to add *${selectedPack.credits} AI Consultation Credits* (₹${selectedPack.price}) on kanhaasa.com.\n\nPlease verify payment to UPI ID: ${upiId} and activate credits.`;
    const url = generateWhatsAppUrl(merchantPhone, msg);
    window.open(url, '_blank');
    handleCompletePayment(`wa_${Date.now()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Recharge AI Consultation Credits
              </h3>
              <p className="text-[11px] text-stone-400">
                कान्हा एआई ज्योतिषाचार्य परामर्श क्रेडिट्स
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOwnerGuide(!showOwnerGuide)}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer bg-stone-900 px-2 py-0.5 rounded border border-stone-700"
              title="दुकानदार / ओनर गाइड: पैसा कैसे आएगा?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Owner Guide</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store Owner Guide Banner */}
        {showOwnerGuide && (
          <div className="p-3.5 bg-amber-950/70 border-b border-amber-800/80 text-xs text-amber-200 space-y-1.5 leading-relaxed">
            <div className="flex items-center justify-between font-bold text-white">
              <span>दुकानदार / ओनर के लिए स्पष्ट गाइड (How Money is Added):</span>
              <button onClick={() => setShowOwnerGuide(false)} className="text-stone-400 hover:text-white">✕</button>
            </div>
            <p>1. <strong>सीधा आपके बैंक में पैसा</strong>: ग्राहक जब नीचे दिए गए UPI QR कोड या PhonePe / GPay नंबर <strong className="text-white font-mono">+91 {merchantPhone}</strong> पर पेमेंट करेगा, तो पैसा सीधे आपके बैंक खाते में पहुंचेगा।</p>
            <p>2. <strong>व्हाट्सएप कन्फर्मेशन</strong>: ग्राहक 'Pay via WhatsApp' पर क्लिक करके स्क्रीनशॉट आपको भेज सकता है।</p>
            <p>3. <strong>ऑटो क्रेडिट्स</strong>: ग्राहक जैसे ही 'Confirm & Add Credits' दबाएगा, उसके सेशन में क्रेडिट्स तुरंत एक्टिव हो जाएंगे और वह सवाल पूछ सकेगा।</p>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {paymentStep === 'select' ? (
            <>
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-stone-300">
                  <span className="font-semibold text-white">क्रेडिट्स लेना अनिवार्य है (Paid AI Consultation)</span>
                  <span className="text-emerald-400 font-mono font-bold">1 Credit = 1 विस्तृत परामर्श / जांच</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  नाम वाइज नंबर चेक, न्यूमरोलॉजी, लो-शू ग्रिड एवं ज्योतिष प्रश्नों के लिए किफायती क्रेडिट पैक चुनकर Razorpay द्वारा तुरंत रिचार्ज करें।
                </p>
              </div>

              {/* Credit Packs Grid */}
              <div className="space-y-2.5">
                {packs.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-stone-950 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                          : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        {pack.badge && (
                          <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider">
                            {pack.badge}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{pack.credits} AI Questions</span>
                          <span className="text-stone-400 text-[11px] font-normal">({pack.name})</span>
                        </h4>
                        <p className="text-[11px] text-stone-400">{pack.desc}</p>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="text-base font-bold text-amber-400 font-mono">₹{pack.price}</span>
                        <span className="block text-[10px] text-stone-500 font-mono">₹{(pack.price / pack.credits).toFixed(1)}/Q</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Devotee Mobile Input for Razorpay Receipts */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1 text-xs">
                <label className="block text-stone-300 font-medium text-[11px]">
                  आपका मोबाइल / व्हाट्सएप नंबर (Payment Receipt & SMS):
                </label>
                <input
                  type="tel"
                  placeholder="+91 91318 05622"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                <button
                  type="button"
                  onClick={handlePayWithRazorpay}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Pay ₹{selectedPack.price} via Razorpay (Instant Credits Auto-Add)</span>
                </button>

                <div className="p-2 bg-stone-950 border border-stone-800 rounded-lg flex items-center justify-between text-[11px] text-stone-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>UPI (Google Pay/PhonePe), Cards, NetBanking</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Live Gateway Active</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentStep('pay')}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Scan UPI QR Code / Manual Bank Transfer</span>
                </button>
              </div>
            </>
          ) : paymentStep === 'pay' ? (
            /* STEP 2: Instant UPI & QR Code Payment */
            <div className="space-y-4">
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400">Selected Plan:</span>
                  <p className="font-bold text-white">{selectedPack.credits} AI Questions Pack</p>
                </div>
                <div className="text-right">
                  <span className="text-stone-400">Payable Amount:</span>
                  <p className="text-base font-bold text-emerald-400 font-mono">₹{selectedPack.price}</p>
                </div>
              </div>

              {/* Direct Razorpay Instant Checkout Trigger */}
              <button
                type="button"
                onClick={handlePayWithRazorpay}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{selectedPack.price} via Razorpay (UPI, GPay, Cards, NetBanking)</span>
              </button>

              {/* Simulated UPI QR Code Frame */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-center space-y-3">
                <div className="relative mx-auto w-40 h-40 bg-white p-2 rounded-lg shadow-inner flex flex-col items-center justify-center">
                  {/* SVG QR Code Simulation with Indian Rupee in center */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="0" y="0" width="100" height="100" fill="#fff" />
                    <rect x="5" y="5" width="28" height="28" fill="#000" />
                    <rect x="9" y="9" width="20" height="20" fill="#fff" />
                    <rect x="13" y="13" width="12" height="12" fill="#000" />
                    <rect x="67" y="5" width="28" height="28" fill="#000" />
                    <rect x="71" y="9" width="20" height="20" fill="#fff" />
                    <rect x="75" y="13" width="12" height="12" fill="#000" />
                    <rect x="5" y="67" width="28" height="28" fill="#000" />
                    <rect x="9" y="71" width="20" height="20" fill="#fff" />
                    <rect x="13" y="75" width="12" height="12" fill="#000" />
                    <rect x="40" y="8" width="6" height="6" fill="#000" />
                    <rect x="52" y="8" width="6" height="14" fill="#000" />
                    <rect x="40" y="24" width="18" height="6" fill="#000" />
                    <rect x="12" y="44" width="8" height="14" fill="#000" />
                    <rect x="28" y="40" width="14" height="8" fill="#000" />
                    <rect x="66" y="44" width="16" height="8" fill="#000" />
                    <rect x="44" y="68" width="8" height="16" fill="#000" />
                    <rect x="60" y="64" width="18" height="8" fill="#000" />
                    <rect x="78" y="76" width="14" height="12" fill="#000" />
                    <circle cx="50" cy="50" r="10" fill="#F59E0B" />
                  </svg>
                  <span className="text-[9px] font-bold text-stone-900 mt-1">Scan via Any UPI App</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="text-stone-400">UPI ID:</span>
                  <span className="font-mono text-white font-bold bg-stone-900 px-2 py-0.5 rounded border border-stone-700">
                    {upiId}
                  </span>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1 hover:text-amber-400 text-stone-400 transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedUpi && <span className="text-[10px] text-emerald-400">Copied!</span>}
                </div>

                <p className="text-[11px] text-stone-400">
                  Supported: PhonePe · Google Pay · Paytm · BHIM · Amazon Pay
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleCompletePayment()}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid ₹{selectedPack.price} · Add {selectedPack.credits} Credits</span>
                </button>

                <button
                  onClick={handleSendWhatsAppProof}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Send Screenshot on WhatsApp (+91 {merchantPhone})</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                  >
                    Choose another credit pack
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 3: Success Confirmation */
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/60">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold font-display text-white">
                {selectedPack.credits} Credits Added Successfully!
              </h4>
              <p className="text-xs text-stone-300 max-w-xs mx-auto">
                Payment verified. You can now ask Kanha AI Acharya all your queries regarding Lo Shu Grid, Mobile Numerology, Mukhis and Gemstones!
              </p>
              {lastPaymentId && (
                <div className="p-2 bg-stone-950 border border-stone-800 rounded font-mono text-[11px] text-stone-400">
                  Transaction Ref: <span className="text-emerald-400">{lastPaymentId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
