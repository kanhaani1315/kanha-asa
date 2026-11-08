import React from 'react';
import { generateWhatsAppUrl } from '../utils/whatsapp';

const WA = '919131805622';

export const BUSINESS: { v: string; hi: string }[] = [
  { v: 'growth', hi: 'बिज़नेस ग्रोथ / व्यापार बढ़ाना है' },
  { v: 'down', hi: 'बिज़नेस डाउन जा रहा है / घाटा' },
  { v: 'customers', hi: 'ग्राहक / ऑर्डर कम हो गए हैं' },
  { v: 'stuck', hi: 'उधारी / पेमेंट फँसा हुआ है' },
  { v: 'new', hi: 'नया बिज़नेस शुरू करना है' },
  { v: 'partner', hi: 'पार्टनर / स्टाफ़ से परेशानी, बरकत नहीं' },
];

export const BUSINESS_AI_RULES =
  'Business remedies - recommend ONLY these, in this order: (1) Kamla Lakshmi Puja and Mahalakshmi Puja for business growth (to be booked and paid for on WhatsApp +91 9131805622); (2) the MANDATORY Potli (sacred pouch) kept at the shop/office/cash box, price Rs 5,500; (3) a Shri Yantra to keep in the shop/office - tell the customer it is available in silver, gold, sphatik (crystal) or bhojpatra, and that the choice and payment are done on WhatsApp +91 9131805622 (do not quote Shri Yantra prices). Explain in one plain line why each helps. Do NOT recommend gemstones or other Rudraksha. Never promise guaranteed profit.';

export const isBusinessTopic = (t: string) => t.includes('बिज़नेस');

export const BusinessRemedy: React.FC<{ note?: string }> = ({ note }) => (
  <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-2">
    <p className="font-bold text-amber-400">व्यापार के लिए उपाय (क्रम से)</p>
    <div>
      <p className="text-stone-100">1. <strong>कमला लक्ष्मी पूजा</strong> और <strong>महालक्ष्मी पूजा</strong></p>
      <p className="text-stone-400 pl-4">व्यापार बढ़ाने, बरकत और धन के रुके रास्ते खोलने के लिए। पूजा बुक करने और पेमेंट के लिए WhatsApp पर संपर्क करें।</p>
    </div>
    <div>
      <p className="text-stone-100">2. <strong>पोटली (अनिवार्य): ₹5,500</strong></p>
      <p className="text-stone-400 pl-4">दुकान / ऑफिस / गल्ले में रखने के लिए। पूजा के साथ पोटली लेना ज़रूरी है।</p>
    </div>
    <div>
      <p className="text-stone-100">3. <strong>श्री यंत्र (अनिवार्य)</strong>: चाँदी, सोना, स्फटिक या भोजपत्र पर</p>
      <p className="text-stone-400 pl-4">आपको कौन सा चाहिए, यह चुनकर कीमत और पेमेंट के लिए WhatsApp पर संपर्क करें।</p>
    </div>
    <a
      href={generateWhatsAppUrl(WA, `प्रणाम, मेरी व्यापार की समस्या है${note ? ` (${note})` : ''}। मुझे कमला लक्ष्मी / महालक्ष्मी पूजा, पोटली (₹5,500) और श्री यंत्र (चाँदी / सोना / स्फटिक / भोजपत्र) के बारे में जानकारी और पेमेंट की प्रक्रिया बताइए।`)}
      target="_blank"
      rel="noreferrer"
      className="inline-block mt-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
    >
      पूजा, पोटली और श्री यंत्र के लिए WhatsApp करें
    </a>
  </div>
);
