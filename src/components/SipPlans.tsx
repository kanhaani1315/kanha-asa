import React, { useState } from 'react';
import { SipPlan } from '../types';
import { SIP_PLANS } from '../data/mockData';
import { Sparkles, CheckCircle2, MessageCircle, ShieldCheck, ArrowRight, Award, FileText, Lock, CreditCard, Zap, QrCode, Copy, Check, ChevronRight, Wallet, AlertCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { trackMetaEvent } from '../utils/metaTracker';
import { InstallmentCertificateModal } from './InstallmentCertificateModal';
import { openRazorpayCheckout, RAZORPAY_KEY_ID } from '../utils/razorpay';

interface SipPlansProps {
  merchantPhone: string;
  onEnrollSip: (plan: SipPlan, customerDetails: { name: string; phone: string; frequency: string }) => void;
}

export const SipPlans: React.FC<SipPlansProps> = ({
  merchantPhone,
  onEnrollSip,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SipPlan>(SIP_PLANS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'razorpay' | 'upi_qr' | 'whatsapp'>('razorpay');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customAmount, setCustomAmount] = useState<number>(1499);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [vaultLockerCode, setVaultLockerCode] = useState('');
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');

  const upiId = `${merchantPhone}@okaxis`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const getPayableAmount = () => {
    if (isCustomMode && customAmount > 0) return customAmount;
    return selectedPlan.amount;
  };

  const handleStartWhatsAppSip = (plan: SipPlan, customAmt?: number) => {
    const amt = customAmt || plan.amount;
    trackMetaEvent('Contact', {
      action: 'start_installment_whatsapp',
      plan_id: plan.id,
      amount: amt,
      frequency: plan.frequency
    });

    const msg = `*Pranam Kanha Asa!* 🕉️\nमैं *${plan.title} (आसान किस्त योजना)* में अपनी किस्त जमा / बुक करना चाहता हूँ।\n\n*किस्त राशि:* ₹${amt.toLocaleString('en-IN')}\n*उद्देश्य:* थोड़ा-थोड़ा पैसा जमा करके दुर्लभ नेपाली रुद्राक्ष को अपने नाम तिजोरी में आरक्षित कराना।\n\nकृपया मेरा दाना रिजर्व कोड (Vault Bead Code) और किस्त रसीद प्रेषित करें।`;

    const url = generateWhatsAppUrl(merchantPhone, msg);
    window.open(url, '_blank');
  };

  const handlePayInstallmentRazorpay = () => {
    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setError('कृपया अपना पूरा नाम और 10 अंकों का मोबाइल / व्हाट्सएप नंबर दर्ज करें');
      return;
    }

    const payableAmount = getPayableAmount();
    if (payableAmount < 100) {
      setError('कृपया न्यूनतम ₹100 की किस्त राशि दर्ज करें');
      return;
    }

    setError('');
    setIsProcessingPayment(true);

    const generatedVaultCode = vaultLockerCode.trim() || `KAS-VAULT-NEP-${Math.floor(10000 + Math.random() * 90000)}`;

    openRazorpayCheckout({
      amount: payableAmount,
      name: `Kanha Asa - ${selectedPlan.title}`,
      description: `रुद्राक्ष किस्त भुगतान: ₹${payableAmount.toLocaleString('en-IN')} (Locker: ${generatedVaultCode})`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: {
        plan_title: selectedPlan.title,
        installment_amount: String(payableAmount),
        frequency: selectedPlan.frequency,
        locker_code: generatedVaultCode,
        merchant_store: 'kanhaasa.com'
      },
      onSuccess: (pId: string) => {
        setPaymentId(pId);
        setVaultLockerCode(generatedVaultCode);
        setIsProcessingPayment(false);
        setEnrolledSuccess(true);

        onEnrollSip(selectedPlan, {
          name: customerName,
          phone: customerPhone,
          frequency: selectedPlan.frequency
        });

        trackMetaEvent('Purchase', {
          content_name: `Installment Plan Payment - ${selectedPlan.title}`,
          value: payableAmount,
          currency: 'INR',
          payment_id: pId,
          plan_id: selectedPlan.id
        });
      },
      onFailure: (err: any) => {
        setIsProcessingPayment(false);
        console.warn('Razorpay checkout failed/closed:', err);
        setError('ऑनलाइन पेमेंट प्रक्रिया पूरी नहीं हो पाई। आप नीचे UPI QR कोड या व्हाट्सएप विकल्प से भी किस्त जमा कर सकते हैं।');
      },
      onDismiss: () => {
        setIsProcessingPayment(false);
      }
    });
  };

  const handleConfirmUpiManual = () => {
    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setError('कृपया अपना पूरा नाम और 10 अंकों का व्हाट्सएप नंबर दर्ज करें');
      return;
    }

    const generatedVaultCode = vaultLockerCode.trim() || `KAS-VAULT-NEP-${Math.floor(10000 + Math.random() * 90000)}`;
    const manualRef = `upi_${Date.now()}`;
    setPaymentId(manualRef);
    setVaultLockerCode(generatedVaultCode);
    setEnrolledSuccess(true);

    onEnrollSip(selectedPlan, {
      name: customerName,
      phone: customerPhone,
      frequency: selectedPlan.frequency
    });

    handleStartWhatsAppSip(selectedPlan, getPayableAmount());
  };

  return (
    <section id="sip-plans" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400 font-semibold bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-500/40">
            <Sparkles className="w-4 h-4" />
            <span>रुद्राक्ष आसान किस्तों में (Installment / SIP Plan) · तिजोरी में दाना आरक्षित</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white" style={{ textWrap: 'balance' }}>
            रुद्राक्ष लेना चाहते हैं और आपका ड्रीम है? परेशान मत होइए!
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
            आप <strong>बहुत ही आसान किस्तों में या थोड़ा-थोड़ा पैसा जमा करके</strong> भी अपने सपनों का दुर्लभ नेपाली रुद्राक्ष या सिद्ध माला बुक करवा सकते हैं।
            पहली किस्त पर ही <strong>वही सेम कोड का दाना</strong> आपके नाम से पवित्र तिजोरी में रिजर्व कर दिया जाएगा और <strong>पूरा भुगतान होने पर ही ISO 9001:2015 लैब सर्टिफिकेट</strong> संग घर डिलीवर होगा।
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-950 border border-amber-500/60 hover:bg-amber-900/60 text-amber-300 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>आधिकारिक नियम व आरक्षण प्रमाण पत्र देखें (View Certificate)</span>
            </button>
            <button
              onClick={() => {
                setIsCustomMode(true);
                setIsModalOpen(true);
                setEnrolledSuccess(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-950 border border-emerald-500/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>अपनी अगली किस्त जमा करें (Pay Ongoing Installment)</span>
            </button>
          </div>
        </div>

        {/* PROMINENT LIVE PAYMENT GATEWAY BADGE BAR */}
        <div className="max-w-5xl mx-auto mb-10 p-4 bg-stone-900/90 border border-amber-500/40 rounded-2xl shadow-xl shadow-amber-950/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <CreditCard className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Razorpay Live Payment Gateway सक्रिय है
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Active
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  स्वीकृत विकल्प: UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, MasterCard, नेटबैंकिंग एवं आसान EMI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedPlan(SIP_PLANS[0]);
                  setIsCustomMode(false);
                  setIsModalOpen(true);
                  setActivePaymentTab('razorpay');
                  setEnrolledSuccess(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>ऑनलाइन किस्त जमा करें (Pay Online)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Strict Guarantees Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-5xl mx-auto text-xs">
          <div className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-600/70 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">वही सेम दाना लॉकर में रिजर्व:</strong>
              <p className="text-stone-400 text-[11px] mt-0.5">पहली किस्त आते ही उस कोड का दाना आपके नाम से सील कर दिया जाएगा। किसी और को नहीं दिया जाएगा।</p>
            </div>
          </div>

          <div className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600/70 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">पूर्ण भुगतान पर दाना डिलीवरी:</strong>
              <p className="text-stone-400 text-[11px] mt-0.5">दाना तभी भेजा जाएगा जब आपकी सभी किस्तें (100% पेमेंट) पूरी हो जाएंगी। अधूरा भुगतान पर नहीं भेजा जाएगा।</p>
            </div>
          </div>

          <div className="p-3.5 bg-stone-900/80 border border-stone-800 rounded-xl flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-600/70 flex items-center justify-center text-blue-400 shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">0% ब्याज व लैब सर्टिफिकेट:</strong>
              <p className="text-stone-400 text-[11px] mt-0.5">कोई ब्याज या गुप्त शुल्क नहीं। अंतिम भुगतान पर 1,008 मंत्रों से प्राण-प्रतिष्ठा व ISO सर्टिफिकेट संग स्पीड पोस्ट।</p>
            </div>
          </div>
        </div>

        {/* 3 Tier Cards: Monthly, Quarterly, Half-Yearly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SIP_PLANS.map((plan) => {
            const isMonthly = plan.frequency === 'monthly';
            const isQuarterly = plan.frequency === 'quarterly';
            const isHalfYearly = plan.frequency === 'half_yearly';

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  plan.popular
                    ? 'bg-stone-900 border-2 border-amber-500 shadow-xl shadow-amber-950/40 -translate-y-1'
                    : 'bg-stone-900/70 border border-stone-800 hover:border-stone-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-stone-950 font-bold text-[11px] uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
                    सर्वाधिक लोकप्रिय किस्त (Most Popular)
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                      {isMonthly ? 'मासिक आसान किस्त (Monthly Installment)' : isQuarterly ? 'त्रैमासिक किस्त (Quarterly Installment)' : 'छमाही किस्त (Half-Yearly Installment)'}
                    </span>
                    <h3 className="text-xl font-bold font-display text-white">
                      {plan.title}
                    </h3>
                  </div>

                  {/* Pricing Display */}
                  <div className="py-2 border-y border-stone-800 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white tabular-nums font-sans">
                      ₹{plan.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400">
                      / {isMonthly ? 'माह' : isQuarterly ? '3 माह' : '6 माह'}
                    </span>
                    <span className="text-xs line-through text-stone-500 tabular-nums ml-auto">
                      ₹{plan.originalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {plan.description}
                  </p>

                  {/* Bead Reservation Highlight */}
                  <div className="p-2.5 bg-stone-950/90 border border-amber-900/50 rounded-lg text-xs space-y-1 text-amber-300">
                    <span className="font-bold flex items-center gap-1 text-[11px] text-amber-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>आरक्षण नियम:</span>
                    </span>
                    <p className="text-[11px] text-stone-300">
                      दाना पूर्ण 100% भुगतान के बाद ही भेजा जाएगा। पहली किस्त आते ही वही सेम दाना आपके नाम तिजोरी में कोड सहित रिजर्व रहेगा।
                    </p>
                  </div>

                  {/* Benefits Checklist */}
                  <ul className="space-y-2.5 pt-1 text-xs text-stone-300 font-sans">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Payment Buttons */}
                <div className="space-y-2.5 pt-5 mt-6 border-t border-stone-800">
                  {/* Primary Razorpay Button */}
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsCustomMode(false);
                      setIsModalOpen(true);
                      setActivePaymentTab('razorpay');
                      setEnrolledSuccess(false);
                      setPaymentId('');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-stone-950" />
                    <span>पहली किस्त ₹{plan.amount.toLocaleString('en-IN')} Razorpay से जमा करें</span>
                  </button>

                  {/* Secondary UPI QR Button */}
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsCustomMode(false);
                      setIsModalOpen(true);
                      setActivePaymentTab('upi_qr');
                      setEnrolledSuccess(false);
                      setPaymentId('');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors border border-stone-700 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>UPI QR कोड द्वारा किस्त जमा करें</span>
                  </button>

                  {/* WhatsApp Support Button */}
                  <button
                    onClick={() => handleStartWhatsAppSip(plan)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 transition-colors border border-emerald-700/60 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>व्हाट्सएप पर सहायता लें (Chat on WhatsApp)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsCertModalOpen(true);
                    }}
                    className="w-full py-1 text-[11px] text-amber-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>आरक्षण प्रमाण पत्र व शर्तें देखें</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CUSTOM ONGOING INSTALLMENT PAY BOX */}
        <div className="mt-12 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                <Wallet className="w-4 h-4" />
                <span>अपनी अगली किस्त या इच्छानुसार राशि जमा करें</span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                पहले से आरक्षित दाने की किस्त या अग्रिम भुगतान करें
              </h3>
              <p className="text-xs text-stone-400 max-w-lg">
                यदि आपने पहले कोई रुद्राक्ष आरक्षित किया है, तो अपना लॉकर कोड और मोबाइल नंबर डालकर किसी भी समय अपनी 2री, 3री या कोई भी किस्त तुरंत जमा कर सकते हैं।
              </p>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsCustomMode(true);
                  setIsModalOpen(true);
                  setActivePaymentTab('razorpay');
                  setEnrolledSuccess(false);
                }}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>किस्त जमा करें (Razorpay Gateway)</span>
              </button>
              <button
                onClick={() => {
                  setIsCustomMode(true);
                  setIsModalOpen(true);
                  setActivePaymentTab('upi_qr');
                  setEnrolledSuccess(false);
                }}
                className="px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>UPI QR से भुगतान</span>
              </button>
            </div>
          </div>
        </div>

        {/* SIP Trust Banner */}
        <div className="mt-8 p-5 bg-amber-950/20 border border-amber-900/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-white text-sm">कान्हा असा पवित्र विश्वास आश्वासन (Sacred Trust Assurance)</p>
              <p className="text-stone-400 text-xs mt-0.5">
                0% ब्याज, कोई लॉक-इन जुर्माना नहीं। दाना पूर्ण भुगतान होने पर मूल ISO 9001:2015 लैब सर्टिफिकेट सहित हमेशा के लिए आपका होगा।
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCertModalOpen(true)}
            className="px-3.5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shrink-0 cursor-pointer"
          >
            आधिकारिक नियम प्रमाण पत्र ➔
          </button>
        </div>
      </div>

      {/* COMPREHENSIVE SIP PAYMENT & ENROLLMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7 shadow-2xl text-stone-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-950/60 cursor-pointer"
            >
              ✕
            </button>

            {!enrolledSuccess ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase text-amber-400 font-semibold tracking-wider">
                    {isCustomMode ? 'किस्त भुगतान (Installment Payment)' : 'आसान किस्त योजना में पंजीकरण'}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">
                    {isCustomMode ? 'रुद्राक्ष किस्त ऑनलाइन भुगतान' : selectedPlan.title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-950 border border-stone-800 rounded-full text-xs font-mono text-amber-300">
                    <span>देय किस्त राशि:</span>
                    <strong className="text-emerald-400 text-sm">₹{getPayableAmount().toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Devotee Info Inputs */}
                <div className="space-y-3 bg-stone-950 p-3.5 rounded-xl border border-stone-800 text-xs">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      भक्त / ग्राहक का पूरा नाम *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल शर्मा"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      व्हाट्सएप मोबाइल नंबर * (जिस पर रसीद व सर्टिफिकेट आएगा)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 91318 05622"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {isCustomMode && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-300 font-medium mb-1">
                          किस्त राशि (₹) *
                        </label>
                        <input
                          type="number"
                          min={100}
                          step={100}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-300 font-medium mb-1">
                          लॉकर / दाना कोड (ऐच्छिक)
                        </label>
                        <input
                          type="text"
                          placeholder="उदा. KAS-VAULT-NEP-..."
                          value={vaultLockerCode}
                          onChange={(e) => setVaultLockerCode(e.target.value)}
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PAYMENT OPTION SELECTOR TABS */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center justify-between">
                    <span>भुगतान का माध्यम चुनें (Select Payment Option):</span>
                    <span className="text-[10px] text-amber-400">100% सुरक्षित भुगतान</span>
                  </label>

                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('razorpay')}
                      className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        activePaymentTab === 'razorpay'
                          ? 'bg-amber-500 text-stone-950 shadow-md'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">Razorpay लाइव</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('upi_qr')}
                      className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        activePaymentTab === 'upi_qr'
                          ? 'bg-amber-500 text-stone-950 shadow-md'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">UPI QR कोड</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePaymentTab('whatsapp')}
                      className={`py-2 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        activePaymentTab === 'whatsapp'
                          ? 'bg-amber-500 text-stone-950 shadow-md'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">व्हाट्सएप ऑटो</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: RAZORPAY LIVE GATEWAY */}
                {activePaymentTab === 'razorpay' && (
                  <div className="space-y-3 bg-stone-950/90 border border-amber-900/40 p-4 rounded-xl">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-800">
                      <span className="text-stone-400">ऑनलाइन गेटवे:</span>
                      <span className="font-mono text-emerald-400 font-bold">Razorpay Live Gateway</span>
                    </div>

                    <div className="space-y-1 text-xs text-stone-300">
                      <p className="flex items-center gap-1.5 text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Google Pay, PhonePe, Paytm, BHIM UPI सीधे सपोर्टेड</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>सभी बैंकों के क्रेडिट / डेबिट कार्ड्स एवं नेटबैंकिंग</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-stone-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>भुगतान होते ही दाना लॉकर में तुरंत कोड सहित आरक्षित होगा</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePayInstallmentRazorpay}
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 px-4 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 fill-stone-950" />
                      <span>
                        {isProcessingPayment
                          ? 'Razorpay गेटवे लोड हो रहा है...'
                          : `किस्त ₹${getPayableAmount().toLocaleString('en-IN')} Razorpay से अभी जमा करें`}
                      </span>
                    </button>
                  </div>
                )}

                {/* TAB 2: UPI QR CODE & DIRECT UPI */}
                {activePaymentTab === 'upi_qr' && (
                  <div className="space-y-3 bg-stone-950/90 border border-stone-800 p-4 rounded-xl text-center">
                    <div className="relative mx-auto w-36 h-36 bg-white p-2 rounded-xl shadow-inner flex flex-col items-center justify-center">
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
                        <circle cx="50" cy="50" r="9" fill="#F59E0B" />
                      </svg>
                      <span className="text-[9px] font-bold text-stone-900 mt-1">₹{getPayableAmount().toLocaleString('en-IN')} Scan to Pay</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-stone-400">दुकानदार UPI ID:</span>
                      <span className="font-mono text-white font-bold bg-stone-900 px-2 py-0.5 rounded border border-stone-700">
                        {upiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="p-1 hover:text-amber-400 text-stone-400 transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleConfirmUpiManual}
                        className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                      >
                        ✓ मैंने ₹{getPayableAmount().toLocaleString('en-IN')} का भुगतान कर दिया है
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: WHATSAPP AUTO-PAY & ASSISTANCE */}
                {activePaymentTab === 'whatsapp' && (
                  <div className="space-y-3 bg-stone-950/90 border border-stone-800 p-4 rounded-xl text-xs">
                    <p className="text-stone-300">
                      व्हाट्सएप द्वारा हमारे आचार्य जी से सीधे जुड़कर अपना दाना कोड आरक्षित कराएं अथवा मासिक ऑटो-डेबिट लिंक प्राप्त करें।
                    </p>
                    <button
                      type="button"
                      onClick={() => handleStartWhatsAppSip(selectedPlan, getPayableAmount())}
                      className="w-full py-3 px-4 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>व्हाट्सएप पर किस्त विवरण भेजें (+91 {merchantPhone})</span>
                    </button>
                  </div>
                )}

                {/* Mandatory Strict Terms Highlight */}
                <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1 text-stone-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>स्पष्ट नियम एवं शर्त (Mandatory Agreement):</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    1. <strong>सेम दाना तिजोरी में आरक्षित:</strong> पहली किस्त आते ही वही सेम कोड का दाना आपके नाम से तिजोरी में सुरक्षित रख दिया जाएगा।<br />
                    2. <strong>डिलीवरी शर्त:</strong> दाना तभी भेजा जाएगा जब आपकी सभी किस्तें (100% भुगतान) पूर्ण हो जाएंगी।
                  </p>
                </div>
              </div>
            ) : (
              /* SUCCESS CONFIRMATION VIEW */
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/60">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  किस्त भुगतान एवं दाना आरक्षण सफल!
                </h3>
                <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                  प्रणाम <strong className="text-white">{customerName}</strong> जी! आपकी किस्त <strong className="text-amber-400">₹{getPayableAmount().toLocaleString('en-IN')}</strong> सफलतापूर्वक जमा हो गई है। 
                  आपका विशिष्ट नेपाली रुद्राक्ष दाना पवित्र तिजोरी में आपके नाम से लॉक कर दिया गया है।
                </p>

                <div className="p-3 bg-stone-950 border border-emerald-800/80 rounded-xl font-mono text-xs text-emerald-300 space-y-1.5 text-left max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-sans">आवंटित दाना कोड:</span>
                    <span className="font-bold text-amber-300">{vaultLockerCode}</span>
                  </div>
                  {paymentId && (
                    <div className="flex justify-between">
                      <span className="text-stone-400 font-sans">Payment Ref ID:</span>
                      <span className="font-bold">{paymentId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-sans">योजना:</span>
                    <span className="text-stone-200 font-sans truncate">{selectedPlan.title}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-900/60 rounded-xl text-xs text-amber-300 text-left space-y-1 max-w-sm mx-auto">
                  <p className="font-semibold text-white">नियम स्मरण:</p>
                  <p className="text-[11px] text-stone-300">
                    पूरा भुगतान होने के पश्चात ही दाना ISO 9001:2015 मूल लैब सर्टिफिकेट, एक्स-रे रिपोर्ट एवं गंगाजल सहित स्पीड पोस्ट से भेजा जाएगा।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto pt-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsCertModalOpen(true);
                    }}
                    className="flex-1 py-3 px-4 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    <span>आरक्षण प्रमाण पत्र डाउनलोड करें</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="py-3 px-4 text-xs font-semibold rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                  >
                    बंद करें
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSTALLMENT OFFICIAL RESERVATION CERTIFICATE MODAL */}
      <InstallmentCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        customerName={customerName || 'आदरणीय भक्त (Devotee)'}
        customerPhone={customerPhone || `+91 ${merchantPhone}`}
        planTitle={selectedPlan.title}
        installmentAmount={getPayableAmount()}
        beadName={selectedPlan.title.includes('सिद्ध') ? 'प्राण-प्रतिष्ठित सिद्ध माला (Siddh Mala 1-14 Mukhi)' : '14 मुखी देवमणि नेपाली रुद्राक्ष (Nepal)'}
        merchantPhone={merchantPhone}
      />
    </section>
  );
};
