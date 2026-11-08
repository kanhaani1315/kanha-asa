import React, { useState, useRef, useEffect } from 'react';
import { AiChatMessage, MobileAnalysisResult, NameNumerologyResult } from '../types';
import { KanhaLogo } from './KanhaLogo';
import { KanhaAiChatIcon } from './AiIcons';
import { AstroWalletModal, WalletChip, useAstroWallet } from './AstroWallet';
import { askAstrologer, reasonText } from '../utils/kanhaApi';
import { calculateGlobalReading } from '../utils/global';
import { calculateNameNumerology, analyzeMobileNumber, calculateLoShuGrid, PLANET_MAP } from '../utils/numerology';
import { 
  Send, 
  Sparkles, 
  Coins, 
  PlusCircle, 
  X, 
  Calculator, 
  MessageSquare, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  AlertTriangle,
  Flame,
  Check,
  RotateCcw,
  UserCheck,
  Lock
} from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { trackMetaEvent } from '../utils/metaTracker';

interface AiAstrologerChatProps {
  merchantPhone: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProductByName?: (productName: string) => void;
}

export const AiAstrologerChat: React.FC<AiAstrologerChatProps> = ({
  merchantPhone,
  isOpen,
  onClose,
  onSelectProductByName,
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'loshu' | 'mobile' | 'global'>('chat');
  const [globalDob, setGlobalDob] = useState('');
  const globalReading = globalDob ? calculateGlobalReading(globalDob) : null;
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'प्रणाम! 🕉️ मैं कान्हा एआई ज्योतिषाचार्य हूँ। रुद्राक्ष चयन, रत्न, राशि, मूलांक-भाग्यांक, लो-शू ग्रिड या मोबाइल नंबर के बारे में कुछ भी पूछिए।\n\n✨ पहले 3 सवाल बिल्कुल फ्री। उसके बाद हर सवाल ₹10 (क्रेडिट्स से)। मोबाइल नंबर से लॉगिन करके शुरू करें।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const wallet = useAstroWallet();
  const [walletReason, setWalletReason] = useState<string | null>(null);
  const needCredits = !!wallet && wallet.free_questions_left <= 0 && wallet.balance < wallet.chat_price;
  const [isTyping, setIsTyping] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditNotice, setCreditNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lo Shu & Name Numerology Interactive State
  const [dobInput, setDobInput] = useState('1994-08-26');
  const [nameInput, setNameInput] = useState('Rahul Sharma');
  const [calculatedLoShu, setCalculatedLoShu] = useState<any>(() => calculateLoShuGrid('1994-08-26'));
  const [nameNumerology, setNameNumerology] = useState<NameNumerologyResult | null>(() => {
    const grid = calculateLoShuGrid('1994-08-26');
    return grid ? calculateNameNumerology('Rahul Sharma', grid.missingNumbers) : null;
  });
  const [activeRemedies, setActiveRemedies] = useState<number[]>([]); // User activated remedy numbers
  const [gridType, setGridType] = useState<'loshu' | 'vedic'>('loshu'); // Lo Shu (Chinese) vs Vedic (Vaidik) grid layout

  // Mobile Numerology State
  const [mobileInput, setMobileInput] = useState('9131805622');
  const [mobileAnalysis, setMobileAnalysis] = useState<MobileAnalysisResult | null>(() => analyzeMobileNumber('9131805622', 8));

  const handleComputeLoShu = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dobInput) return;

    const result = calculateLoShuGrid(dobInput);
    setCalculatedLoShu(result);

    // Compute Name Numerology on the missing numbers
    if (nameInput.trim() && result) {
      const nameRes = calculateNameNumerology(nameInput, result.missingNumbers);
      setNameNumerology(nameRes);
    }

    trackMetaEvent('ViewContent', {
      content_name: 'Lo Shu & Name Numerology Computed',
      dob: dobInput,
      name: nameInput
    });
  };

  const handleToggleRemedy = (num: number) => {
    setActiveRemedies((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleAnalyzeMobile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = mobileInput.replace(/\D/g, '');
    if (clean.length < 10) return;

    const result = analyzeMobileNumber(clean, calculatedLoShu?.mulank);
    setMobileAnalysis(result);

    trackMetaEvent('ViewContent', {
      content_name: 'Mobile Number Numerology Analyzed',
      phone: mobileInput,
      score: result.score
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    if (!wallet) {
      setWalletReason('login_required');
      setShowCreditModal(true);
      return;
    }
    if (needCredits) {
      setWalletReason('need_credits');
      setShowCreditModal(true);
      return;
    }

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const history = messages.slice(1).map((m) => ({ role: (m.sender === 'user' ? 'user' : 'ai') as 'user' | 'ai', text: m.text }));
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setCreditNotice(null);

    trackMetaEvent('Contact', { action: 'ai_chatbot_question', question: text.slice(0, 50) });

    const r = await askAstrologer(text, history);
    setIsTyping(false);
    if (r.ok && r.answer) {
      setMessages((prev) => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: String(r.answer),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInputText(text);
      if (r.reason === 'need_credits' || r.reason === 'login_required') {
        setWalletReason(r.reason);
        setShowCreditModal(true);
      } else {
        setCreditNotice(reasonText(r.reason));
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeMode, isOpen]);

  // Helper for Lo Shu 3x3 Grid rendering
  // Matrix Standard Lo Shu:
  // 4  9  2
  // 3  5  7
  // 8  1  6
  const loShuOrder = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];
  // Vedic (Vaidik) numerology grid layout:
  // 3  1  9
  // 6  7  5
  // 2  8  4
  const vedicOrder = [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4]
  ];
  const gridOrder = gridType === 'vedic' ? vedicOrder : loShuOrder;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl h-[90vh] bg-stone-900 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100">
          {/* Header */}
          <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <KanhaAiChatIcon size={38} />
              <div>
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                  <span>Kanha AI Acharya</span>
                  <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[12px] font-mono">
                    Lo Shu & Mobile Astro
                  </span>
                </h3>
                <p className="text-[13px] text-stone-400">
                  1-21 Mukhi, Gemstones & Numerology · Direct Buy on www.kanhaasa.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WalletChip wallet={wallet} onClick={() => { setWalletReason(null); setShowCreditModal(true); }} />

              <button
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3 Interactive Mode Tabs */}
          <div className="flex border-b border-stone-800 bg-stone-950 text-xs">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'chat'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI चैटबॉट</span>
            </button>

            <button
              onClick={() => setActiveMode('loshu')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'loshu'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>नियो ग्रिड (मिसिंग नंबर)</span>
            </button>

            <button
              onClick={() => setActiveMode('mobile')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'mobile'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>मोबाइल नंबर जांच</span>
            </button>
            <button
              onClick={() => setActiveMode('global')}
              className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'global'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-stone-900/50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ग्लोबल रीडिंग</span>
            </button>
          </div>

          {/* TAB 1: AI CHAT VIEW */}
          {activeMode === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-950/60">
                {messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[92%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                    >
                      {isAi && (
                        <div className="w-7 h-7 rounded-full bg-amber-950 border border-amber-700/80 flex items-center justify-center text-xs text-amber-300 shrink-0 mt-1">
                          🕉️
                        </div>
                      )}
                      <div
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          isAi
                            ? 'bg-stone-900 border border-stone-800 text-stone-200'
                            : 'bg-amber-500 text-stone-950 font-medium'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span className={`block text-[12px] mt-1.5 font-mono ${isAi ? 'text-stone-500' : 'text-stone-900'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex gap-2 mr-auto items-center text-xs text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[13px] text-stone-400">कान्हा एआई विश्लेषण कर रहा है...</span>
                  </div>
                )}

                {creditNotice && (
                  <div className="p-3 bg-red-950/40 border border-red-800 rounded-xl text-xs text-red-300">{creditNotice}</div>
                )}
                {(!wallet || needCredits) && (
                  <div className="p-3 bg-amber-950/60 border border-amber-500 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                    <span className="font-semibold">
                      {!wallet ? 'सवाल पूछने के लिए मोबाइल नंबर से लॉगिन करें — पहले 3 सवाल फ्री।' : 'आपके फ्री सवाल और क्रेडिट्स खत्म हो गए। हर सवाल ₹10 — रिचार्ज करें।'}
                    </span>
                    <button
                      onClick={() => { setWalletReason(!wallet ? 'login_required' : 'need_credits'); setShowCreditModal(true); }}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer whitespace-nowrap shadow shrink-0"
                    >
                      {!wallet ? 'लॉगिन करें' : '⚡ क्रेडिट्स लें (₹99 से)'}
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-2.5 bg-stone-900 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[13px] text-stone-500 font-medium shrink-0 pl-1">Ask:</span>
                {[
                  'कौन सा रुद्राक्ष लेना है?',
                  'कौन सा रुद्राक्ष स्टोन सही रहेगा?',
                  'मेरी राशि के अनुसार कौन सा रत्न?',
                  'मोबाइल में हानिकारक नंबर कैसे देखें?',
                  'नाम से मिसिंग नंबर कैसे जोड़ें?',
                  'रुद्राक्ष धारण करने की विधि क्या है?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 text-[13px] bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={
                    !wallet
                      ? 'लॉगिन करके सवाल पूछें (पहले 3 सवाल फ्री)...'
                      : wallet.free_questions_left > 0
                        ? `प्रश्न पूछें (${wallet.free_questions_left} फ्री सवाल बाकी)... रुद्राक्ष, रत्न, राशि, न्यूमरोलॉजी`
                        : `प्रश्न पूछें (₹10/सवाल, बैलेंस ₹${wallet.balance})...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: LO SHU & NAME NUMEROLOGY MISSING NUMBER BALANCER */}
          {activeMode === 'loshu' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-stone-950">
              {/* Lo Shu tool is free */}
              {false && (
                <div className="p-3 bg-amber-950/60 border border-amber-500 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>नाम वाइज नंबर चेक, न्यूमरोलॉजी एवं लो-शू ग्रिड जांच के लिए क्रेडिट्स लेना आवश्यक है (फ्री नहीं रहेगा)।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreditModal(true)}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer whitespace-nowrap shadow shrink-0"
                  >
                    ⚡ क्रेडिट्स खरीदें (₹19+)
                  </button>
                </div>
              )}

              {/* Inputs Form: DOB + Full Name */}
              <form onSubmit={handleComputeLoShu} className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      जन्म तिथि (Date of Birth) *
                    </label>
                    <input
                      type="date"
                      value={dobInput}
                      onChange={(e) => setDobInput(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1 flex items-center justify-between">
                      <span>पूरा नाम (Full Name) *</span>
                      <span className="text-[12px] text-amber-400 font-normal">चेल्डियन नाम सुधार</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[13px] text-stone-400">
                    नाम के अक्षर ग्रिड में मिसिंग नंबरों की पूर्ति करते हैं।
                  </p>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ग्रिड और मिसिंग नंबर जांचें
                  </button>
                </div>
              </form>

              {calculatedLoShu && (
                <div className="space-y-5">
                  {/* Driver & Conductor Summary */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                      <span className="text-[12px] text-stone-400">मूलांक (Driver)</span>
                      <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{calculatedLoShu.mulank}</p>
                      <p className="text-[12px] text-stone-400">{PLANET_MAP[calculatedLoShu.mulank]}</p>
                    </div>

                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                      <span className="text-[12px] text-stone-400">भाग्यांक (Conductor)</span>
                      <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{calculatedLoShu.bhagyank}</p>
                      <p className="text-[12px] text-stone-400">{PLANET_MAP[calculatedLoShu.bhagyank]}</p>
                    </div>

                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                      <span className="text-[12px] text-stone-400">नामांक (Name Number)</span>
                      <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">{nameNumerology?.singleDigit || '-'}</p>
                      <p className="text-[12px] text-stone-400">कुल योग: {nameNumerology?.compoundNumber}</p>
                    </div>
                  </div>

                  {/* 3x3 Dynamic Neo Grid */}
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{gridType === 'vedic' ? '3x3 वैदिक ग्रिड (Vedic / Vaidik Grid)' : '3x3 नियो ग्रिड (Neo Lo Shu Grid Matrix)'}</span>
                      </span>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>जन्म से उपलब्ध</span>
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>नाम से जुड़ा</span>
                        </span>
                        <span className="flex items-center gap-1 text-blue-300">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>उपाय से सक्रिय</span>
                        </span>
                      </div>
                    </div>

                    {/* Grid type toggle: Lo Shu / Vedic */}
                    <div className="flex items-center justify-center gap-2 text-[13px]">
                      <button
                        type="button"
                        onClick={() => setGridType('loshu')}
                        className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                          gridType === 'loshu'
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-stone-950 border-stone-700 text-stone-300 hover:border-amber-600'
                        }`}
                      >
                        लो शू ग्रिड (Lo Shu)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGridType('vedic')}
                        className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                          gridType === 'vedic'
                            ? 'bg-amber-600 border-amber-500 text-white'
                            : 'bg-stone-950 border-stone-700 text-stone-300 hover:border-amber-600'
                        }`}
                      >
                        वैदिक ग्रिड (Vedic)
                      </button>
                    </div>

                    {/* Matrix */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm mx-auto">
                      {gridOrder.map((row, rIdx) =>
                        row.map((cellNum) => {
                          const isBirth = calculatedLoShu.birthNumbers.includes(cellNum);
                          const isNameAdded = nameNumerology?.numbersAddedToGrid.includes(cellNum) && !isBirth;
                          const isRemedyAdded = activeRemedies.includes(cellNum);

                          return (
                            <div
                              key={cellNum}
                              onClick={() => {
                                if (!isBirth && !isNameAdded) {
                                  handleToggleRemedy(cellNum);
                                }
                              }}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border transition-all cursor-pointer ${
                                isBirth
                                  ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                                  : isNameAdded
                                  ? 'bg-amber-950/70 border-amber-400 text-amber-200 ring-1 ring-amber-400/50'
                                  : isRemedyAdded
                                  ? 'bg-blue-950/70 border-blue-400 text-blue-200'
                                  : 'bg-stone-950 border-stone-800 text-red-400/80 hover:border-red-600'
                              }`}
                            >
                              <span className="text-2xl font-bold font-mono">
                                {isBirth || isNameAdded || isRemedyAdded ? cellNum : '—'}
                              </span>
                              <span className="text-[12px] font-sans font-medium mt-1">
                                {isBirth
                                  ? 'उपस्थित'
                                  : isNameAdded
                                  ? '✨ नाम से'
                                  : isRemedyAdded
                                  ? '🌿 उपाय सक्रिय'
                                  : `मिसिंग ${cellNum}`}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Name Impact Analysis */}
                  {nameNumerology && (
                    <div className="p-3.5 bg-stone-900 border border-amber-900/60 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <UserCheck className="w-4 h-4" />
                        <span>नाम न्यूमरोलॉजी प्रभाव: {nameNumerology.name}</span>
                      </div>
                      <p className="text-stone-300 text-[13px] leading-relaxed">
                        {nameNumerology.recommendation}
                      </p>
                      {nameNumerology.missingNumbersFulfilled.length > 0 && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[13px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>नाम द्वारा स्वतः भरे गए नंबर: {nameNumerology.missingNumbersFulfilled.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remedies to Add Remaining Missing Numbers */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>मिसिंग नंबरों के वैदिक रुद्राक्ष व रत्न उपाय (Click to add to Grid):</span>
                    </h4>

                    <div className="space-y-2">
                      {calculatedLoShu.remedies.map((rem: any) => {
                        const isFilledByName = nameNumerology?.missingNumbersFulfilled.includes(rem.number);
                        const isRemedyOn = activeRemedies.includes(rem.number);

                        return (
                          <div
                            key={rem.number}
                            className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                              isFilledByName
                                ? 'bg-amber-950/30 border-amber-800'
                                : isRemedyOn
                                ? 'bg-blue-950/40 border-blue-600'
                                : 'bg-stone-900 border-stone-800'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full font-bold font-mono text-[13px] flex items-center justify-center ${
                                  isFilledByName ? 'bg-amber-500 text-stone-950' : 'bg-red-950 text-red-300 border border-red-800'
                                }`}>
                                  {rem.number}
                                </span>
                                <span className="font-bold text-white">मिसिंग नंबर {rem.number}:</span>
                                <span className="text-stone-400 text-[13px]">{rem.defect}</span>
                              </div>
                              <p className="text-amber-300 text-[13px] pl-7">
                                उपाय: <strong>{rem.rudraksha}</strong> · रत्न: <strong>{rem.stone}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pl-7 sm:pl-0">
                              <button
                                onClick={() => handleToggleRemedy(rem.number)}
                                className={`px-2.5 py-1 rounded text-[13px] font-semibold transition-colors cursor-pointer ${
                                  isRemedyOn
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                                }`}
                              >
                                {isRemedyOn ? 'ग्रिड में जुड़ा है ✓' : '+ ग्रिड में जोड़ें'}
                              </button>

                              <button
                                onClick={() => {
                                  onClose();
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[13px] transition-colors cursor-pointer"
                              >
                                Buy on Kanhaasa.com
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MOBILE NUMBER NUMEROLOGY ANALYZER */}
          {activeMode === 'global' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950">
              <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-stone-300">जन्म तिथि (Date of Birth) *</label>
                <input
                  type="date"
                  value={globalDob}
                  onChange={(e) => setGlobalDob(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[13px] text-stone-400">दुनिया के अलग-अलग सिस्टम से आपकी रीडिंग: Life Path (पश्चिम), Sun Sign, Chinese Zodiac, बर्मी जन्म-वार।</p>
              </div>
              {globalReading && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl">
                    <p className="font-bold text-amber-400">Life Path Number: {globalReading.lifePath}</p>
                    <p className="text-stone-200 mt-1">{globalReading.lifePathInfo.hi} ({globalReading.lifePathInfo.en})</p>
                    <p className="text-amber-300 mt-1">सुझाया रुद्राक्ष: <strong>{globalReading.lifePathInfo.rudraksha}</strong></p>
                  </div>
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                    <p className="font-bold text-white">Western Sun Sign: {globalReading.sunSign.en} ({globalReading.sunSign.hi})</p>
                  </div>
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                    <p className="font-bold text-white">Chinese Zodiac: {globalReading.chinese.en} ({globalReading.chinese.hi})</p>
                    <p className="text-stone-400 mt-1">नोट: जनवरी-फरवरी के जन्म में चीनी नव वर्ष के हिसाब से पिछला जानवर हो सकता है।</p>
                  </div>
                  <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                    <p className="font-bold text-white">बर्मी जन्म-वार: {globalReading.burmese.day}</p>
                    <p className="text-stone-200 mt-1">जानवर: {globalReading.burmese.animal}</p>
                    <p className="text-stone-400 mt-1">ग्रह: {globalReading.burmese.planet} · दिशा: {globalReading.burmese.dir}</p>
                  </div>
                  <p className="text-[12px] text-stone-500">यह मार्गदर्शन व मनोरंजन के लिए है, कोई गारंटी नहीं।</p>
                </div>
              )}
            </div>
          )}

          {activeMode === 'mobile' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-stone-950">
              {/* Mobile numerology tool is free */}
              {false && (
                <div className="p-3 bg-amber-950/60 border border-amber-500 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>मोबाइल नंबर न्यूमरोलॉजी व हानिकारक जोड़े जांचने के लिए क्रेडिट्स लेना आवश्यक है (फ्री नहीं रहेगा)।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCreditModal(true)}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer whitespace-nowrap shadow shrink-0"
                  >
                    ⚡ क्रेडिट्स खरीदें (₹19+)
                  </button>
                </div>
              )}

              {/* Mobile Input */}
              <form onSubmit={handleAnalyzeMobile} className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    अपना 10 अंकों का मोबाइल नंबर दर्ज करें (Enter Mobile Number) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9131805622"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono text-sm tracking-wider"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      जांचें (Analyze)
                    </button>
                  </div>
                </div>
                <p className="text-[13px] text-stone-400">
                  यह टूल आपके मोबाइल नंबर के हानिकारक जोड़े (2-4, 1-8, 4-8) और शुभ योग (1-5, 5-6) की वैदिक गणना करता है।
                </p>
              </form>

              {mobileAnalysis && (
                <div className="space-y-4">
                  {/* Rating Card */}
                  <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[13px] text-stone-400">मोबाइल नंबर वैदिक मूल्यांकन:</span>
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{mobileAnalysis.overallRating}</span>
                      </h4>
                      <p className="text-xs text-amber-300">{mobileAnalysis.advice}</p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-stone-400">अनुकूलता स्कोर:</span>
                      <p className="text-3xl font-extrabold text-emerald-400 font-mono">
                        {mobileAnalysis.score}<span className="text-xs text-stone-500 font-normal">/100</span>
                      </p>
                      <span className="text-[13px] text-stone-400 font-mono">
                        कुल मूलांक: <strong>{mobileAnalysis.rootNumber}</strong> ({mobileAnalysis.rulingPlanet})
                      </span>
                    </div>
                  </div>

                  {/* Harmful Combinations Warning */}
                  {mobileAnalysis.harmfulPairsFound.length > 0 ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                        <Flame className="w-4 h-4" />
                        <span>पहचाने गए हानिकारक जोड़े (Harmful Combinations Detected):</span>
                      </div>

                      <div className="space-y-2">
                        {mobileAnalysis.harmfulPairsFound.map((hp, idx) => (
                          <div key={idx} className="p-3.5 bg-red-950/30 border border-red-800/80 rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-300 font-mono text-sm bg-red-950 px-2 py-0.5 rounded border border-red-800">
                                जोड़ा: {hp.pair}
                              </span>
                              <span className="text-[12px] text-red-400 uppercase font-bold tracking-wider">
                                {hp.name}
                              </span>
                            </div>

                            <p className="text-stone-300 text-[13px] leading-relaxed">
                              <strong>हानिकारक प्रभाव:</strong> {hp.effects}
                            </p>

                            <div className="pt-2 border-t border-red-900/40 flex flex-wrap items-center justify-between gap-2 text-[13px]">
                              <span className="text-amber-300">
                                <strong>दोष निवारक उपाय:</strong> {hp.remedyRudraksha} / {hp.remedyGemstone}
                              </span>
                              <button
                                onClick={() => {
                                  onClose();
                                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded cursor-pointer"
                              >
                                Buy Remedy
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>बधाई! आपके मोबाइल नंबर में कोई प्रमुख हानिकारक जोड़ा (2-4, 1-8, 4-8) नहीं पाया गया।</span>
                    </div>
                  )}

                  {/* Lucky Combinations */}
                  {mobileAnalysis.luckyPairsFound.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>शुभ व भाग्यशाली योग (Auspicious Combinations Found):</span>
                      </div>

                      <div className="space-y-2">
                        {mobileAnalysis.luckyPairsFound.map((lp, idx) => (
                          <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-emerald-300 font-mono text-sm">
                                योग: {lp.pair}
                              </span>
                              <span className="text-[12px] text-emerald-400 font-bold">
                                {lp.name}
                              </span>
                            </div>
                            <p className="text-stone-300 text-[13px]">{lp.effects}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Remedy Action */}
                  <div className="p-4 bg-stone-900 border border-amber-900/60 rounded-xl text-xs space-y-2.5">
                    <span className="font-bold text-white uppercase tracking-wider text-[13px]">
                      मोबाइल नंबर दोष निवारण एवं ऊर्जा सुरक्षा कवच:
                    </span>
                    <p className="text-stone-300 text-[13px] leading-relaxed">
                      मोबाइल नंबर की तरंगों को शुद्ध करने के लिए <strong>{mobileAnalysis.recommendedRemedies.rudraksha}</strong> अथवा <strong>{mobileAnalysis.recommendedRemedies.gemstone}</strong> पहनें।
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-emerald-400 font-mono font-bold">10% / 15% छूट उपलब्ध</span>
                      <button
                        onClick={() => {
                          onClose();
                          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Order on www.kanhaasa.com
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login / Recharge Modal */}
      <AstroWalletModal isOpen={showCreditModal} reason={walletReason} onClose={() => setShowCreditModal(false)} />
    </>
  );
};
