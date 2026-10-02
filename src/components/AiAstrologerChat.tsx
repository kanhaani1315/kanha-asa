import React, { useState, useRef, useEffect } from 'react';
import { AiChatMessage, MobileAnalysisResult, NameNumerologyResult } from '../types';
import { KanhaLogo } from './KanhaLogo';
import { KanhaAiChatIcon } from './AiIcons';
import { CreditPaymentModal } from './CreditPaymentModal';
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
  const [activeMode, setActiveMode] = useState<'chat' | 'loshu' | 'mobile'>('chat');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'प्रणाम! 🕉️ मैं कान्हा एआई ज्योतिषाचार्य हूँ। वैदिक परामर्श, नाम न्यूमरोलॉजी, लो-शू ग्रिड एवं मोबाइल नंबर जांच के लिए क्रेडिट्स लेना आवश्यक है (क्रेडिट्स लेना पड़ेगा, फ्री नहीं रहेगा)।\n\nआप न्यूनतम ₹19 से क्रेडिट्स रिचार्ज करके पूछ सकते हैं:\n• नाम वाइज नंबर चेक (Name Numerology) व मिसिंग नंबर सुधार\n• 3x3 लो-शू ग्रिड (Lo Shu Grid), मूलांक व भाग्यांक संतुलन\n• 10 अंकों का मोबाइल नंबर विश्लेषण (शुभ व हानिकारक जोड़े)\n• 1 से 21 मुखी रुद्राक्ष एवं वैदिक रत्न चयन',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [credits, setCredits] = useState<number>(0); // Credit lena padega, free nahi rahega
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

  // Mobile Numerology State
  const [mobileInput, setMobileInput] = useState('9131805622');
  const [mobileAnalysis, setMobileAnalysis] = useState<MobileAnalysisResult | null>(() => analyzeMobileNumber('9131805622', 8));

  const handleComputeLoShu = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dobInput) return;

    if (credits <= 0) {
      setCreditNotice('नाम वाइज नंबर चेक, न्यूमरोलॉजी व लो-शू ग्रिड जांच के लिए क्रेडिट्स लेना आवश्यक है (फ्री नहीं रहेगा)। कृपया क्रेडिट पैक चुनें।');
      setShowCreditModal(true);
      return;
    }

    setCredits((prev) => Math.max(0, prev - 1));
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

    if (credits <= 0) {
      setCreditNotice('10 अंकों के मोबाइल नंबर की न्यूमरोलॉजी जांच के लिए क्रेडिट्स लेना आवश्यक है (फ्री नहीं रहेगा)। कृपया क्रेडिट पैक चुनें।');
      setShowCreditModal(true);
      return;
    }

    setCredits((prev) => Math.max(0, prev - 1));
    const result = analyzeMobileNumber(clean, calculatedLoShu?.mulank);
    setMobileAnalysis(result);

    trackMetaEvent('ViewContent', {
      content_name: 'Mobile Number Numerology Analyzed',
      phone: mobileInput,
      score: result.score
    });
  };

  const generateAiTextResponse = (userPrompt: string): string => {
    const p = userPrompt.toLowerCase();

    // Mobile Number Query
    if (p.includes('mobile') || p.includes('phone') || p.includes('नंबर') || p.includes('हानिकारक') || p.includes('कॉम्बिनेशन') || p.includes('मोबाइल')) {
      return `मोबाइल नंबर न्यूमरोलॉजी जांच रिपोर्ट (Kanha AI Analysis):\n\n• हानिकारक कॉम्बिनेशन (Harmful Pairs):\n  - 2-4 या 4-2: चन्द्र-राहु ग्रहण दोष (अचानक मानसिक व धन हानि)\n  - 1-8 या 8-1: सूर्य-शनि संघर्ष (सरकारी अड़चनें, पिता से मतभेद)\n  - 4-8 या 8-4: राहु-शनि महासंघर्ष (दुर्घटना व कर्ज की चिंता)\n  - 3-6 या 6-3: गुरु-शुक्र विवाद (दांपत्य कलह, व्यर्थ खर्च)\n\n• शुभ व भाग्यशाली कॉम्बिनेशन (Lucky Pairs):\n  - 1-5 / 5-1: बुधादित्य योग (व्यापार में तीव्र वृद्धि)\n  - 5-6 / 6-5: महालक्ष्मी योग (धन-संपदा व ऐश्वर्य)\n  - 3-7 / 7-3: गुरु-केतु ज्ञान योग\n\nअपने 10 अंकों के मोबाइल नंबर की तुरंत जांच करने के लिए ऊपर "मोबाइल नंबर जांच" टैब पर जाएं!`;
    }

    // Lo Shu & Name Missing Number Query
    if (p.includes('loshu') || p.includes('lo shu') || p.includes('grid') || p.includes('मिसिंग') || p.includes('नाम') || p.includes('name') || p.includes('नियो ग्रिड')) {
      return `नियो ग्रिड एवं नाम न्यूमरोलॉजी (Lo Shu Grid Name Balancing):\n\n• जन्मतिथि से कई बार ग्रिड में 4, 3, 8 या 7 जैसे महत्वपूर्ण नंबर मिसिंग हो जाते हैं।\n• कान्हा एआई का नया फीचर: अब आप अपना नाम (Name) डालकर भी मिसिंग नंबर की भरपाई कर सकते हैं (चेल्डियन न्यूमरोलॉजी के अनुसार A=1, B=2, C=3, D=4, E=5 आदि)।\n• साथ ही, जो नंबर नाम से भी न भरें, उन्हें 7 मुखी, 8 मुखी, 14 मुखी रुद्राक्ष या पुखराज/नीलम रत्न पहनकर ग्रिड में एक्टिव किया जा सकता है।\n\nऊपर "नियो ग्रिड (मिसिंग नंबर)" टैब खोलकर अपना नाम और जन्मतिथि दर्ज करके लाइव ग्रिड देखें!`;
    }

    // Which Rudraksha / Gemstone combination to take
    if (p.includes('kaun sa') || p.includes('konsa') || p.includes('stone') || p.includes('rudraksha') || p.includes('gemstone') || p.includes('रत्न') || p.includes('रुद्राक्ष')) {
      return `कान्हा असा प्रामाणिक रुद्राक्ष एवं रत्न संयोजन (Prescription Guide):\n\n1. व्यापार व महालक्ष्मी धन प्राप्ति: 7 मुखी नेपाली रुद्राक्ष (₹4,500) + इटालियन लाल मूंगा कैप्सूल (₹8,900)। (10% छूट के साथ कुल पर विशेष बचत!)\n2. शनि साढ़ेसाती व करियर स्थायित्व: 14 मुखी देवमणि रुद्राक्ष (₹48,000) या रॉयल ब्लू नीलम रत्न।\n3. एकाग्रता व सर्वसिद्धि: 1 मुखी नेपाली गोल दाना (₹35,000) या साउथ दाना रजत त्रिनेत्र (₹3,800)।\n4. वैवाहिक सुख व दांपत्य शांति: प्राकृतिक गौरी शंकर रुद्राक्ष (₹18,500) + सच्चा मोती।\n\nसभी प्रोडक्ट 100% कान्हा असा ISO 9001:2015 लैब सर्टिफिकेट और फ्री पैन-इंडिया शिपिंग के साथ www.kanhaasa.com पर उपलब्ध हैं।`;
    }

    // Cost / Pricing query
    if (p.includes('price') || p.includes('cost') || p.includes('kitne') || p.includes('rupaye') || p.includes('discount') || p.includes('voucher') || p.includes('coupon') || p.includes('दाम')) {
      return `कान्हा असा का 3-स्तरीय आधिकारिक डिस्काउंट स्लैब:\n\n• 10% छूट (कोड: KANHA10): ₹10,000 से कम के सभी ऑर्डर पर (जैसे 1 मुखी साउथ दाना ₹3,800 -> मात्र ₹3,420; 7 मुखी महालक्ष्मी ₹4,500 -> मात्र ₹4,050)।\n• 15% छूट (कोड: KANHA15): ₹10,000 से ₹1,00,000 के ऑर्डर पर (जैसे गौरी शंकर ₹18,500 -> ₹15,725; 14 मुखी देवमणि ₹48,000 -> ₹40,800)।\n• 25% बम्पर छूट (कोड: KANHA25): ₹1,00,000 और उससे अधिक के आर्डर पर।\n\nपूरे भारत में शिपिंग बिल्कुल FREE है! कैश ऑन डिलीवरी (COD) केवल ₹150 चार्ज में उपलब्ध है। सीधा www.kanhaasa.com से ऑनलाइन ऑर्डर करें।`;
    }

    return `वैदिक विश्लेषण के अनुसार आपके ग्रहों का ऊर्जा संतुलन अत्यंत महत्वपूर्ण है। कान्हा असा पर प्रत्येक 1 से 21 मुखी नेपाली रुद्राक्ष एवं रत्न आपके गोत्र से 1,008 वैदिक बीजोक्त मंत्रों से अभिमंत्रित करके भेजा जाता है।\n\nविशेष छूट:\n• ₹10,000 के नीचे: 10% OFF (KANHA10)\n• ₹10,000 के ऊपर: 15% OFF (KANHA15)\n• ₹1 लाख+: 25% OFF (KANHA25)\n\nसीधे www.kanhaasa.com से ऑनलाइन सुरक्षित चेकआउट करें!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (credits <= 0) {
      setCreditNotice('ज्योतिष परामर्श व सवाल पूछने के लिए क्रेडिट्स लेना आवश्यक है (क्रेडिट्स लेना पड़ेगा, फ्री नहीं रहेगा)। कृपया क्रेडिट पैक रिचार्ज करें।');
      setShowCreditModal(true);
      return;
    }

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setCredits((prev) => Math.max(0, prev - 1));
    setIsTyping(true);

    trackMetaEvent('Contact', {
      action: 'ai_chatbot_question',
      question: text.slice(0, 50),
      remaining_credits: credits - 1
    });

    setTimeout(() => {
      const response = generateAiTextResponse(text);
      const aiMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleAddCreditsFromModal = (newCredits: number, price: number) => {
    setCredits((prev) => prev + newCredits);
    setCreditNotice(null);
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
                  <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px] font-mono">
                    Lo Shu & Mobile Astro
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  1-21 Mukhi, Gemstones & Numerology · Direct Buy on www.kanhaasa.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreditModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-600/70 rounded-full text-xs text-amber-300 font-semibold hover:bg-amber-900/60 transition-colors cursor-pointer"
                title="Click to recharge credits"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums font-mono font-bold">{credits} Credits</span>
                <PlusCircle className="w-3 h-3 text-amber-400" />
              </button>

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
                        <span className={`block text-[10px] mt-1.5 font-mono ${isAi ? 'text-stone-500' : 'text-stone-900'}`}>
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
                    <span className="text-[11px] text-stone-400">कान्हा एआई विश्लेषण कर रहा है...</span>
                  </div>
                )}

                {/* Credit Required Notice */}
                {credits <= 0 && (
                  <div className="p-3 bg-amber-950/60 border border-amber-500 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                    <span className="font-semibold">परामर्श व सवाल पूछने के लिए क्रेडिट्स लेना आवश्यक है (क्रेडिट्स लेना पड़ेगा, फ्री नहीं रहेगा)।</span>
                    <button
                      onClick={() => setShowCreditModal(true)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer whitespace-nowrap shadow shrink-0"
                    >
                      ⚡ क्रेडिट्स लें (₹19 से शुरू)
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="p-2.5 bg-stone-900 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] text-stone-500 font-medium shrink-0 pl-1">Ask:</span>
                {[
                  'कौन सा रुद्राक्ष लेना है?',
                  'कौन सा रुद्राक्ष स्टोन सही रहेगा?',
                  'कितने का पड़ेगा (Prices & 10%-25% OFF)?',
                  'मोबाइल में हानिकारक नंबर कैसे देखें?',
                  'नाम से मिसिंग नंबर कैसे जोड़ें?',
                  '1 Mukhi Gol Dana vs South Dana price?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 text-[11px] bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                    credits > 0
                      ? `प्रश्न पूछें (${credits} क्रेडिट्स बाकी)... रुद्राक्ष, रत्न, मिसिंग नंबर या मोबाइल जांच`
                      : 'क्रेडिट्स समाप्त! सवाल पूछने के लिए रिचार्ज करें (Recharge Credits).'
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
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
              {/* Credit Notice Banner for Lo Shu */}
              {credits <= 0 && (
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
                      <span className="text-[10px] text-amber-400 font-normal">चेल्डियन नाम सुधार</span>
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
                  <p className="text-[11px] text-stone-400">
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
                      <span className="text-[10px] text-stone-400">मूलांक (Driver)</span>
                      <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{calculatedLoShu.mulank}</p>
                      <p className="text-[10px] text-stone-400">{PLANET_MAP[calculatedLoShu.mulank]}</p>
                    </div>

                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                      <span className="text-[10px] text-stone-400">भाग्यांक (Conductor)</span>
                      <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{calculatedLoShu.bhagyank}</p>
                      <p className="text-[10px] text-stone-400">{PLANET_MAP[calculatedLoShu.bhagyank]}</p>
                    </div>

                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg">
                      <span className="text-[10px] text-stone-400">नामांक (Name Number)</span>
                      <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">{nameNumerology?.singleDigit || '-'}</p>
                      <p className="text-[10px] text-stone-400">कुल योग: {nameNumerology?.compoundNumber}</p>
                    </div>
                  </div>

                  {/* 3x3 Dynamic Neo Grid */}
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>3x3 नियो ग्रिड (Neo Lo Shu Grid Matrix)</span>
                      </span>
                      <div className="flex items-center gap-2 text-[10px]">
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

                    {/* Matrix */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm mx-auto">
                      {loShuOrder.map((row, rIdx) =>
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
                              <span className="text-[10px] font-sans font-medium mt-1">
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
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {nameNumerology.recommendation}
                      </p>
                      {nameNumerology.missingNumbersFulfilled.length > 0 && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
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
                                <span className={`w-5 h-5 rounded-full font-bold font-mono text-[11px] flex items-center justify-center ${
                                  isFilledByName ? 'bg-amber-500 text-stone-950' : 'bg-red-950 text-red-300 border border-red-800'
                                }`}>
                                  {rem.number}
                                </span>
                                <span className="font-bold text-white">मिसिंग नंबर {rem.number}:</span>
                                <span className="text-stone-400 text-[11px]">{rem.defect}</span>
                              </div>
                              <p className="text-amber-300 text-[11px] pl-7">
                                उपाय: <strong>{rem.rudraksha}</strong> · रत्न: <strong>{rem.stone}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pl-7 sm:pl-0">
                              <button
                                onClick={() => handleToggleRemedy(rem.number)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
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
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-colors cursor-pointer"
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
          {activeMode === 'mobile' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-stone-950">
              {/* Credit Notice Banner for Mobile Numerology */}
              {credits <= 0 && (
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
                <p className="text-[11px] text-stone-400">
                  यह टूल आपके मोबाइल नंबर के हानिकारक जोड़े (2-4, 1-8, 4-8) और शुभ योग (1-5, 5-6) की वैदिक गणना करता है।
                </p>
              </form>

              {mobileAnalysis && (
                <div className="space-y-4">
                  {/* Rating Card */}
                  <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-400">मोबाइल नंबर वैदिक मूल्यांकन:</span>
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
                      <span className="text-[11px] text-stone-400 font-mono">
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
                              <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">
                                {hp.name}
                              </span>
                            </div>

                            <p className="text-stone-300 text-[11px] leading-relaxed">
                              <strong>हानिकारक प्रभाव:</strong> {hp.effects}
                            </p>

                            <div className="pt-2 border-t border-red-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
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
                              <span className="text-[10px] text-emerald-400 font-bold">
                                {lp.name}
                              </span>
                            </div>
                            <p className="text-stone-300 text-[11px]">{lp.effects}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Remedy Action */}
                  <div className="p-4 bg-stone-900 border border-amber-900/60 rounded-xl text-xs space-y-2.5">
                    <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                      मोबाइल नंबर दोष निवारण एवं ऊर्जा सुरक्षा कवच:
                    </span>
                    <p className="text-stone-300 text-[11px] leading-relaxed">
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

      {/* Credit Payment & Recharge Modal */}
      <CreditPaymentModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onAddCredits={handleAddCreditsFromModal}
        merchantPhone={merchantPhone}
      />
    </>
  );
};
