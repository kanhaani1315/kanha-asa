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
  'Legal-matter remedy - recommend ONLY the Baglamukhi Mata Puja (Maa Baglamukhi). Explain that this puja is performed in full: Baglamukhi Yantra sthapana, Vedic havan and mantra jaap, all done for the customer (for removing enemy obstacles and bringing stability and strength in court and disputes). Tell the customer that to book the puja they must share their case details: case number / file number, court name, court number and judge name, and that booking and payment are done by contacting Kanha Asa on WhatsApp +91 9131805622 (do not quote prices). Explain the reason from Vedic astrology in plain words (6th house = court, opponents and litigation; 7th house = spouse and partnership disputes; 8th/12th = delay and expense; Saturn = delay, Rahu = confusion, Mars = conflict). Never promise that the case will be won or a divorce/settlement will happen; say clearly in one line that the customer should also follow their lawyer\'s advice and keep documents ready, and the puja is spiritual support. Do NOT recommend gemstones or Rudraksha.';

export const isLegalTopic = (t: string) => t.includes('कोर्ट') || t.includes('कानूनी') || t.includes('तलाक') || t.includes('ज़मीन');

const inp = 'w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400';

export const LegalRemedy: React.FC<{ note?: string; pujas?: { name: string; why: string }[] }> = ({ note, pujas }) => {
  const [caseNo, setCaseNo] = React.useState('');
  const [court, setCourt] = React.useState('');
  const [courtNo, setCourtNo] = React.useState('');
  const [judge, setJudge] = React.useState('');
  const [notFiled, setNotFiled] = React.useState(false);
  const ready = notFiled || (caseNo.trim() && court.trim() && courtNo.trim() && judge.trim());
  const details = notFiled
    ? 'केस अभी दर्ज नहीं हुआ है (केस करना है)।'
    : `केस/फ़ाइल नंबर: ${caseNo}, कोर्ट का नाम: ${court}, कोर्ट नंबर: ${courtNo}, जज का नाम: ${judge}।`;
  const extra = (pujas || []).filter((x) => x.name !== 'बगलामुखी माता की पूजा');
  return (
    <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-2">
      <p className="font-bold text-amber-400">कोर्ट / कानूनी मामले के लिए उपाय</p>
      <div>
        <p className="text-stone-100"><strong>बगलामुखी माता की पूजा</strong></p>
        <p className="text-stone-400 pl-4">शत्रु बाधा, कोर्ट-कचहरी, ज़मीन-जायदाद और तलाक जैसे विवादों में स्थिरता और विजय के लिए। इस पूजा में ये सब किया जाता है:</p>
        <p className="text-stone-100 pl-4">• बगलामुखी माता का यंत्र (स्थापना)</p>
        <p className="text-stone-100 pl-4">• वैदिक हवन</p>
        <p className="text-stone-100 pl-4">• मंत्र जाप (आपके नाम से)</p>
      </div>
      {extra.length > 0 && (
        <div className="pt-1">
          <p className="font-bold text-amber-400">कुंडली के अनुसार साथ में ये भी</p>
          {extra.map((x) => (
            <div key={x.name}><p className="text-stone-100">• <strong>{x.name}</strong></p><p className="text-stone-400 pl-4">{x.why}</p></div>
          ))}
        </div>
      )}
      <div className="p-3 bg-stone-950 border border-stone-700 rounded-lg space-y-2">
        <p className="font-bold text-amber-400">पूजा बुक करने के लिए केस की जानकारी ज़रूरी है</p>
        <label className="flex items-center gap-2 text-stone-300 text-[13px] cursor-pointer">
          <input type="checkbox" checked={notFiled} onChange={(e) => setNotFiled(e.target.checked)} /> केस अभी दर्ज नहीं हुआ है (केस करना है)
        </label>
        {!notFiled && (
          <>
            <input value={caseNo} onChange={(e) => setCaseNo(e.target.value)} placeholder="केस नंबर / फ़ाइल नंबर" className={inp} />
            <input value={court} onChange={(e) => setCourt(e.target.value)} placeholder="कोर्ट का नाम (जैसे: ज़िला न्यायालय, रीवा)" className={inp} />
            <input value={courtNo} onChange={(e) => setCourtNo(e.target.value)} placeholder="कोर्ट नंबर" className={inp} />
            <input value={judge} onChange={(e) => setJudge(e.target.value)} placeholder="जज का नाम" className={inp} />
          </>
        )}
        {ready ? (
          <a
            href={generateWhatsAppUrl(WA, `प्रणाम, मेरा कानूनी मामला है${note ? ` (${note})` : ''}। ${details} मुझे बगलामुखी माता की पूजा (यंत्र, वैदिक हवन और मंत्र जाप सहित) करवानी है। कृपया जानकारी और पेमेंट की प्रक्रिया बताइए।`)}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            बगलामुखी पूजा बुक करें (WhatsApp)
          </a>
        ) : (
          <p className="text-amber-300 text-[13px]">चारों जानकारी भरने के बाद WhatsApp बटन दिखेगा।</p>
        )}
      </div>
      <p className="text-stone-400 text-[13px]">अदालती कार्रवाई में अपने वकील की सलाह और कागज़ात साथ रखें। पूजा आध्यात्मिक सहारा है।</p>
    </div>
  );
};
