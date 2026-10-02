import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, PhoneCall, Bot } from 'lucide-react';
import { AiCallingIcon, KanhaAiChatIcon } from './AiIcons';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { trackMetaEvent } from '../utils/metaTracker';

interface FloatingWhatsAppProps {
  merchantPhone: string;
  onOpenAiChat: () => void;
  onOpenAiCalling: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  merchantPhone,
  onOpenAiChat,
  onOpenAiCalling,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const quickPrompts = [
    { title: 'Suggest 1-21 Mukhi for My Rashi', text: 'Pranam Pandit Ji! 🕉️ Can you analyze my Rashi and suggest which 1 to 21 Mukhi Rudraksha I should wear?' },
    { title: 'Inquire About 1 Mukhi (Nepali/South Dana)', text: 'Pranam! 🕉️ I want price and certificate details for authentic 1 Mukhi (Nepali Gol Dana / South Dana in Silver).' },
    { title: 'Start Monthly Rudraksha SIP (₹999/mo)', text: 'Pranam Kanha Asa! 🕉️ I want to start a monthly/quarterly Rudraksha SIP with ISO 9001:2015 certificates.' },
    { title: 'Track My Order Dispatch Status', text: 'Pranam Kanha Asa! 🕉️ I want to check the energization and dispatch status of my Rudraksha order.' }
  ];

  const handleSendPrompt = (text: string) => {
    trackMetaEvent('Contact', {
      action: 'floating_whatsapp_prompt',
      prompt_text: text
    });
    const url = generateWhatsAppUrl(merchantPhone, text);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    handleSendPrompt(customQuery.trim());
    setCustomQuery('');
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Quick Prompt Modal / Popover */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-88 bg-stone-900 border border-amber-900/60 rounded-xl shadow-2xl overflow-hidden text-stone-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-emerald-950 p-4 border-b border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold">
                  🕉️
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-stone-900" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-display">Kanha Asa Astrologer</h4>
                <p className="text-[11px] text-emerald-300 font-sans">Official Verified Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-300 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts List */}
          <div className="p-3.5 space-y-2 bg-stone-950">
            {/* AI Call & Chat Shortcuts */}
            <div className="grid grid-cols-2 gap-2 pb-1 border-b border-stone-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAiChat();
                }}
                className="p-2 bg-stone-900 hover:bg-stone-800 border border-amber-900/50 rounded flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
              >
                <KanhaAiChatIcon size={16} />
                <span>AI ज्योतिषी चैट</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAiCalling();
                }}
                className="p-2 bg-stone-900 hover:bg-stone-800 border border-emerald-900/50 rounded flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
              >
                <AiCallingIcon size={16} />
                <span>AI Voice Call</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 font-medium px-1 pt-1">
              Select inquiry or write below:
            </p>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(p.text)}
                className="w-full text-left p-2.5 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800/80 text-xs text-stone-200 hover:text-amber-300 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>{p.title}</span>
                <Sparkles className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100" />
              </button>
            ))}

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-2 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Type question on WhatsApp..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
              />
              <button
                type="submit"
                className="p-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Icons Dock (AI Astrologer, AI Calling, WhatsApp) */}
      <div className="flex items-center gap-2">
        {/* 1. AI Astrologer Icon Button (Name Numerology, Mobile Check, Lo Shu Grid) */}
        <button
          onClick={onOpenAiChat}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold shadow-2xl shadow-amber-950/70 transition-all duration-200 hover:scale-105 cursor-pointer text-xs"
          title="AI ज्योतिषी: नाम न्यूमरोलॉजी, मोबाइल नंबर जांच, लो-शू ग्रिड (क्रेडिट्स द्वारा)"
        >
          <KanhaAiChatIcon size={20} />
          <span className="hidden sm:inline font-bold">AI ज्योतिषी (ग्रिड व मोबाइल जांच)</span>
        </button>

        {/* 2. AI Voice Calling Icon Button */}
        <button
          onClick={onOpenAiCalling}
          className="p-3 rounded-full bg-stone-900 border border-emerald-500/60 hover:bg-emerald-950 text-emerald-400 shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer"
          title="AI Phone Calling Consultation"
        >
          <AiCallingIcon size={22} />
        </button>

        {/* 3. WhatsApp Icon Button (No written number text) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Connect on WhatsApp"
          className="relative p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-950/60 transition-all duration-200 hover:scale-105 cursor-pointer"
          title="WhatsApp Support"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        </button>
      </div>
    </div>
  );
};

