import React from 'react';
import { generateWhatsAppUrl } from '../utils/whatsapp';

const WA = '919131805622';

export const LEGAL: { v: string; hi: string }[] = [
  { v: 'court', hi: 'कोर्ट केस चल रहा है / कचहरी में मामला है' },
  { v: 'land', hi: 'ज़मीन / प्रॉपर्टी का विवाद' },
  { v: 'file', hi: 'केस करना है / करवाना है' },
  { v: 'divorce', hi: 'तलाक का केस / तलाक नहीं हो रहा' },
  { v: 'wife', hi: 'पत्नी घर छोड़कर चली गई है' },
  { v: 'family', hi: 'पति-पत्नी या परिवार का कोर्ट विवाद' },
  { v: 'false', hi: 'झूठा केस / फँसाया गया है' },
  { v: 'other', hi: 'कोई और कानूनी समस्या' },
];

export const LEGAL_AI_RULES =
  'Legal-matter remedies - recommend ONLY these, in this order: (1) Baglamukhi Mata Puja (Maa Baglamukhi, for removing enemy obstacles and stability/success in court and disputes); (2) a Baglamukhi Yantra to keep and worship; (3) Baglamukhi mantra jaap / anushthan performed for the customer. Tell the customer that booking, jaap and payment are done by contacting Kanha Asa on WhatsApp +91 9131805622 (do not quote prices). Explain the reason from Vedic astrology in plain words (6th house = court, opponents and litigation; 7th house = spouse and partnership disputes; 8th/12th = delay and expense; Saturn = delay, Rahu = confusion, Mars = conflict). Never promise that the case will be won or a divorce/settlement will happen; say clearly in one line that the customer should also follow their lawyer\'s advice and keep documents ready, and the puja is spiritual support. Do NOT recommend gemstones or Rudraksha.';

export const isLegalTopic = (t: string) => t.includes('कोर्ट') || t.includes('कानूनी') || t.includes('तलाक') || t.includes('ज़मीन');

export const LegalRemedy: React.FC<{ note?: string; pujas?: { name: string; why: string }[] }> = ({ note, pujas }) => (
  <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-2">
    <p className="font-bold text-amber-400">कोर्ट / कानूनी मामले के लिए उपाय (क्रम से)</p>
    <div>
      <p className="text-stone-100">1. <strong>बगलामुखी माता की पूजा</strong></p>
      <p className="text-stone-400 pl-4">शत्रु बाधा, कोर्ट-कचहरी, ज़मीन-जायदाद और तलाक जैसे विवादों में स्थिरता और विजय के लिए।</p>
    </div>
    <div>
      <p className="text-stone-100">2. <strong>बगलामुखी यंत्र</strong></p>
      <p className="text-stone-400 pl-4">घर या पूजा स्थान में स्थापित करने के लिए।</p>
    </div>
    <div>
      <p className="text-stone-100">3. <strong>बगलामुखी मंत्र जाप / अनुष्ठान</strong></p>
      <p className="text-stone-400 pl-4">आपके नाम से जाप करवाने के लिए। जाप और पेमेंट के लिए WhatsApp पर संपर्क करें।</p>
    </div>
    {pujas && pujas.filter((x) => x.name !== 'बगलामुखी माता की पूजा').length > 0 && (
      <div className="pt-1">
        <p className="font-bold text-amber-400">कुंडली के अनुसार साथ में ये भी</p>
        {pujas.filter((x) => x.name !== 'बगलामुखी माता की पूजा').map((x) => (
          <div key={x.name}><p className="text-stone-100">• <strong>{x.name}</strong></p><p className="text-stone-400 pl-4">{x.why}</p></div>
        ))}
      </div>
    )}
    <p className="text-stone-400 text-[13px]">अदालती कार्रवाई में अपने वकील की सलाह और कागज़ात साथ रखें। पूजा आध्यात्मिक सहारा है।</p>
    <a
      href={generateWhatsAppUrl(WA, `प्रणाम, मेरा कानूनी मामला है${note ? ` (${note})` : ''}। मुझे बगलामुखी माता की पूजा, बगलामुखी यंत्र और मंत्र जाप के बारे में जानकारी और पेमेंट की प्रक्रिया बताइए।`)}
      target="_blank"
      rel="noreferrer"
      className="inline-block mt-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
    >
      बगलामुखी पूजा, यंत्र और जाप के लिए WhatsApp करें
    </a>
  </div>
);
