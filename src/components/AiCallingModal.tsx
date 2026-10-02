import React, { useState, useEffect } from 'react';
import { PhoneCall, PhoneOff, Mic, MicOff, Sparkles, Coins, CheckCircle2, Clock, Volume2, X, AlertCircle } from 'lucide-react';
import { AiCallingIcon } from './AiIcons';
import { KanhaLogo } from './KanhaLogo';
import { trackMetaEvent } from '../utils/metaTracker';

interface AiCallingModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantPhone: string;
}

export const AiCallingModal: React.FC<AiCallingModalProps> = ({
  isOpen,
  onClose,
  merchantPhone,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [consultTopic, setConsultTopic] = useState('Rudraksha Selection (1 to 21 Mukhi)');
  const [callRequested, setCallRequested] = useState(false);
  const [callingMinutes, setCallingMinutes] = useState(5); // 5 free starter credits
  const [isLiveCall, setIsLiveCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'recharge'>('request');
  const [customRechargeMins, setCustomRechargeMins] = useState(15);

  useEffect(() => {
    let interval: any;
    if (isLiveCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isLiveCall]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestCall = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) return;

    if (callingMinutes <= 0) {
      setActiveTab('recharge');
      return;
    }

    trackMetaEvent('Lead', {
      lead_type: 'ai_outbound_call_requested',
      customer_name: customerName,
      customer_phone: phoneNumber,
      topic: consultTopic,
      minutes_available: callingMinutes
    });

    setCallRequested(true);
  };

  const handleBuyMinutes = (mins: number, price: number) => {
    trackMetaEvent('Lead', {
      lead_type: 'ai_calling_recharge',
      minutes: mins,
      price: price
    });
    setCallingMinutes((prev) => prev + mins);
    setRechargeSuccess(`Added ${mins} Calling Minutes successfully!`);
    setTimeout(() => {
      setRechargeSuccess(null);
      setActiveTab('request');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100">
        {/* Header with AI Calling icon */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AiCallingIcon size={40} />
            <div>
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <span>Kanha AI Voice Astrologer Calling</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-mono font-bold">
                  AI CALLS YOU
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Outbound Neural Voice Consultation · 24x7 AI Telephony Astrologer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('recharge')}
              className="px-2.5 py-1 bg-amber-950/80 border border-amber-800 hover:border-amber-600 rounded text-xs text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Click to recharge minutes"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="tabular-nums font-mono">{callingMinutes} Mins</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        {!isLiveCall && (
          <div className="flex border-b border-stone-800 bg-stone-950 text-xs">
            <button
              onClick={() => setActiveTab('request')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors cursor-pointer ${
                activeTab === 'request'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Request AI Phone Call
            </button>
            <button
              onClick={() => setActiveTab('recharge')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors cursor-pointer ${
                activeTab === 'recharge'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Recharge Calling Balance
            </button>
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* SIMULATED IN-PROGRESS CALL */}
          {isLiveCall ? (
            <div className="py-6 text-center space-y-6">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-950 border-4 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-950/60">
                <AiCallingIcon size={56} />
                <span className="absolute -bottom-1 px-2.5 py-0.5 bg-emerald-600 text-[10px] font-bold rounded-full text-white">
                  CALL ACTIVE
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold font-display text-white">
                  Kanha AI Voice Astrologer
                </h4>
                <p className="text-xs text-amber-400 font-mono mt-0.5">
                  Private Outbound Voice Call · Connected
                </p>
                <p className="text-2xl font-mono font-bold text-white tabular-nums mt-2">
                  {formatTimer(callDuration)}
                </p>
              </div>

              {/* Animated Voice Spectrum */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[30, 65, 95, 45, 100, 75, 40, 85, 60, 90, 35].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-emerald-400 rounded-full animate-pulse transition-all duration-300"
                  />
                ))}
              </div>

              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 max-w-sm mx-auto italic">
                "प्रणाम! 🕉️ मैं कान्हा एआई ज्योतिषाचार्य बोल रहा हूँ। अपना जन्म विवरण, न्यूमरोलॉजी या 1 से 21 मुखी रुद्राक्ष एवं रत्न के बारे में पूछिए..."
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3.5 rounded-full border transition-colors cursor-pointer ${
                    isMuted ? 'bg-red-950 border-red-700 text-red-300' : 'bg-stone-800 border-stone-700 text-stone-200'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => {
                    setIsLiveCall(false);
                    if (callDuration > 10) {
                      setCallingMinutes((prev) => Math.max(0, prev - 1));
                    }
                  }}
                  className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-red-950/60 cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End AI Call</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'request' ? (
            /* TAB 1: Request Outbound Call */
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AiCallingIcon size={16} />
                    <span>AI Outbound Calling System</span>
                  </span>
                  <span className="text-amber-400 font-semibold font-mono">{callingMinutes} Mins Left</span>
                </div>
                <p className="text-xs text-stone-300 font-sans leading-relaxed">
                  एआई सीधे आपके फोन पर कॉल करेगा (पब्लिक को कोई नंबर नहीं दिखाया जाता)। अपना नंबर दर्ज करें और कॉल का अनुरोध करें।
                </p>
              </div>

              {!callRequested ? (
                <form onSubmit={handleRequestCall} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Enter Your 10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 91318 05622"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Consultation Topic
                    </label>
                    <select
                      value={consultTopic}
                      onChange={(e) => setConsultTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="Rudraksha Selection (1 to 21 Mukhi)">Rudraksha Selection (1 to 21 Mukhi)</option>
                      <option value="Lo Shu Grid & Numerology Remedies">Lo Shu Grid & Numerology Remedies</option>
                      <option value="Certified Astrological Gemstone Prescription">Certified Astrological Gemstone Prescription</option>
                      <option value="Pricing, Disounts & Order via Kanhaasa.com">Pricing, Discounts & Order via Kanhaasa.com</option>
                      <option value="Siddh Mala & Silver Capping Guidance">Siddh Mala & Silver Capping Guidance</option>
                    </select>
                  </div>

                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-[11px] text-stone-400 space-y-1">
                    <p className="text-white font-medium">How AI Calling Works:</p>
                    <p>• AI Astrologer initiates a direct voice call to your entered mobile.</p>
                    <p>• You speak naturally in Hindi or English — AI answers all questions about Mukhis, Gemstones, and Lo Shu Grid.</p>
                    <p>• Call charges deduct from your recharged balance. Need more minutes? Recharge anytime below.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Initiate AI Call to My Phone</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setIsLiveCall(true)}
                      className="text-xs text-amber-400 hover:underline cursor-pointer font-medium"
                    >
                      Or Test with In-Browser Voice Simulator
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950/60">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold font-display text-white">
                    AI Phone Call Dispatched!
                  </h4>
                  <p className="text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
                    AI Astrologer is placing an automated call to <strong className="text-white font-mono">{phoneNumber}</strong> right now. Please accept the incoming call on your phone.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setCallRequested(false)}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      Call another number or change topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: Recharge Calling Minutes */
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold font-display text-white">
                  Recharge AI Calling Balance
                </h4>
                <p className="text-xs text-stone-400">
                  Select a pack to talk with Kanha AI Astrologer on phone.
                </p>
              </div>

              {rechargeSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{rechargeSuccess}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <div
                  onClick={() => handleBuyMinutes(10, 49)}
                  className="p-3 bg-stone-950 border border-stone-800 hover:border-amber-500 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="font-bold text-white group-hover:text-amber-300">10 Minutes AI Voice Call</p>
                    <p className="text-[11px] text-stone-400">Quick Mukhi recommendation & mantra check</p>
                  </div>
                  <span className="font-bold text-amber-400 text-base font-mono">₹49</span>
                </div>

                <div
                  onClick={() => handleBuyMinutes(30, 149)}
                  className="p-3 bg-stone-950 border-2 border-amber-500 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors shadow-md group"
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold text-amber-400 tracking-wider">Most Popular</span>
                    <p className="font-bold text-white group-hover:text-amber-300">30 Minutes Deep Jyotish Call</p>
                    <p className="text-[11px] text-stone-400">Complete horoscope reading & Lo Shu Grid remedies</p>
                  </div>
                  <span className="font-bold text-amber-400 text-base font-mono">₹149</span>
                </div>

                <div
                  onClick={() => handleBuyMinutes(65, 299)}
                  className="p-3 bg-stone-950 border border-stone-800 hover:border-amber-500 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors group"
                >
                  <div>
                    <p className="font-bold text-white group-hover:text-amber-300">65 Minutes VIP Family Call</p>
                    <p className="text-[11px] text-stone-400">Extended astrological analysis for entire family</p>
                  </div>
                  <span className="font-bold text-amber-400 text-base font-mono">₹299</span>
                </div>
              </div>

              {/* Custom Minutes Recharge */}
              <div className="p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs space-y-2">
                <span className="text-stone-300 font-medium">Custom Minutes Recharge:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={customRechargeMins}
                    onChange={(e) => setCustomRechargeMins(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-white font-mono"
                  />
                  <span className="text-stone-400 text-[11px]">Mins = ₹{Math.round(customRechargeMins * 4.9)}</span>
                  <button
                    onClick={() => handleBuyMinutes(customRechargeMins, Math.round(customRechargeMins * 4.9))}
                    className="ml-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    Recharge
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-stone-500">
                  Payments processed securely. Free 10% coupon <span className="text-amber-400 font-mono">KANHA10</span> on first order at www.kanhaasa.com.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

