import React, { useState } from 'react';
import { DECK, TAROT_REV, REMEDY, calculateGlobalReading } from '../utils/global';
import { askAstrologer, getToken, reasonText } from '../utils/kanhaApi';
import { generateWhatsAppUrl } from '../utils/whatsapp';

const SPREADS = [
  { v: 'three', hi: 'अतीत · वर्तमान · भविष्य (3 कार्ड)', pos: ['अतीत (Past)', 'वर्तमान (Present)', 'भविष्य (Future)'] },
  { v: 'present', hi: 'सिर्फ़ वर्तमान (1 कार्ड)', pos: ['वर्तमान (Present)'] },
  { v: 'past', hi: 'सिर्फ़ अतीत (1 कार्ड)', pos: ['अतीत (Past)'] },
  { v: 'future', hi: 'सिर्फ़ भविष्य (1 कार्ड)', pos: ['भविष्य (Future)'] },
];
const TOPICS = ['सामान्य', 'प्रेम / रिश्ता', 'करियर / नौकरी', 'धन / व्यापार', 'स्वास्थ्य / मन की शांति', 'शादी / परिवार'];

const shuffled = () => Array.from({ length: DECK.length }, (_, i) => i).sort(() => Math.random() - 0.5);
const card = 'p-3 bg-stone-900 border border-stone-800 rounded-xl';
const sel = 'w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400';

const Face: React.FC<{ i: number; rev: boolean }> = ({ i, rev }) => (
  <div className={`w-28 h-44 rounded-xl border-2 border-amber-500 bg-gradient-to-b from-indigo-950 via-stone-900 to-purple-950 flex flex-col items-center justify-between py-2 shadow-lg ${rev ? 'rotate-180' : ''}`}>
    <span className="text-amber-300 text-xs font-bold tracking-widest">{DECK[i].label}</span>
    <span className="text-5xl">{DECK[i].sym}</span>
    <div className="text-center px-1">
      <p className="text-amber-200 text-[11px] font-bold leading-tight">{DECK[i].n}</p>
      <p className="text-stone-300 text-[10px]">{DECK[i].hi}</p>
    </div>
  </div>
);

const Back: React.FC<{ picked?: boolean; onClick: () => void }> = ({ picked, onClick }) => (
  <button onClick={onClick} className={`w-12 h-20 shrink-0 rounded-md border-2 bg-gradient-to-br from-purple-900 to-indigo-950 text-amber-400 text-lg cursor-pointer transition-transform ${picked ? 'border-amber-300 -translate-y-2 ring-2 ring-amber-400' : 'border-amber-700 hover:-translate-y-1'}`}>✦</button>
);

export const TarotReader: React.FC<{ onBuy: () => void; onNeed: (r: string) => void }> = ({ onBuy, onNeed }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [question, setQuestion] = useState('');
  const [spread, setSpread] = useState('three');
  const [deck, setDeck] = useState<number[]>(shuffled);
  const [picked, setPicked] = useState<number[]>([]);
  const [rev, setRev] = useState<Record<number, boolean>>({});
  const [shown, setShown] = useState(false);
  const [ai, setAi] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const sp = SPREADS.find((s) => s.v === spread)!;
  const need = sp.pos.length;

  const reset = (keepSpread = true) => {
    setDeck(shuffled()); setPicked([]); setRev({}); setShown(false); setAi(''); setErr('');
    if (!keepSpread) setSpread('three');
  };
  const toggle = (i: number) => {
    if (shown) return;
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length < need ? [...p, i] : p));
  };
  const open = () => {
    if (!getToken()) return onNeed('login_required');
    const r: Record<number, boolean> = {};
    picked.forEach((i) => { r[i] = Math.random() < 0.3; });
    setRev(r); setShown(true);
    deepReading(r);
  };
  const last = picked.length ? picked[picked.length - 1] : 0;
  const R = REMEDY[DECK[last].t];

  const deepReading = async (rv: Record<number, boolean> = rev) => {
    if (!getToken()) return onNeed('login_required');
    setBusy(true); setErr(''); setAi('');
    const g = dob ? calculateGlobalReading(dob) : null;
    const cards = picked.map((i, k) => `${sp.pos[k]}: ${DECK[i].n}${rv[i] ? ' (reversed)' : ''}`).join('; ');
    const msg = `[TAROT READING - speak like an experienced real tarot reader, directly to the person by name; this is a serious genuine reading, not entertainment.] Name: ${name || 'ji'}. Date of birth: ${dob || 'not given'}${g ? ` (Life Path ${g.lifePath}, Sun sign ${g.sunSign.en}, Chinese zodiac ${g.chinese.en})` : ''}. Topic: ${topic}. Question: ${question || 'general guidance'}. Cards drawn (${sp.v} spread): ${cards}. Explain each card in its position and tie it to the question and the person's numbers, say what is likely to unfold and when in general terms (no guarantees), then give remedies in this order: Rudraksha first, gemstone second, puja third. End with: for a detailed personal consultation WhatsApp Kanha Asa on +91 9131805622.`;
    const r = await askAstrologer(msg, []);
    setBusy(false);
    if (r.ok && r.answer) return setAi(String(r.answer));
    if (r.reason === 'login_required') { setErr('रीडिंग पाने के लिए पहले मोबाइल नंबर से लॉगिन करें।'); return onNeed(r.reason); }
    if (r.reason === 'need_credits') { setErr('आपका पहला फ्री सवाल हो चुका है। अपनी रीडिंग पाने के लिए वॉलेट में पैसे डालें (₹10 प्रति रीडिंग)।'); return onNeed(r.reason); }
    setErr(reasonText(r.reason));
  };

  return (
    <div className="space-y-3">
      <div className={`${card} space-y-2`}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="आपका नाम" className={sel} />
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${sel} font-mono`} title="जन्म तिथि" />
        <p className="text-[12px] text-stone-400">जन्म तिथि डालने से रीडिंग आपके अंक और ग्रहों के हिसाब से होती है।</p>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={sel}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="अपना सवाल या मन की बात लिखें (जैसे: मेरी नौकरी कब बदलेगी?)" rows={2} className={sel} />
        <select value={spread} onChange={(e) => { setSpread(e.target.value); reset(); }} className={sel}>{SPREADS.map((s) => <option key={s.v} value={s.v}>{s.hi}</option>)}</select>
      </div>

      {!shown && (
        <div className={card}>
          <p className="text-stone-200 mb-2">अपने सवाल पर ध्यान लगाकर <strong>{need} कार्ड</strong> चुनें (78 कार्ड का डेक) ({picked.length}/{need} चुने)</p>
          <div className="flex gap-1.5 overflow-x-auto pb-3 pt-2">
            {deck.map((i) => <Back key={i} picked={picked.includes(i)} onClick={() => toggle(i)} />)}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => reset()} className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold cursor-pointer">🔀 कार्ड फेंटें</button>
            <button onClick={open} disabled={picked.length !== need} className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold cursor-pointer">🔮 कार्ड खोलें</button>
          </div>
        </div>
      )}

      {shown && (
        <div className="space-y-3">
          <p className="text-amber-300 font-bold">{name ? `${name} जी, ` : ''}आपकी टैरो रीडिंग{question ? ` · सवाल: "${question}"` : ''}</p>
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
            {picked.map((i, k) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-amber-400 font-bold text-[13px]">{sp.pos[k]}</p>
                <Face i={i} rev={!!rev[i]} />
                {rev[i] && <p className="text-red-300 text-[11px]">उल्टा कार्ड</p>}
              </div>
            ))}
          </div>
          {picked.map((i, k) => (
            <div key={i} className="p-3 bg-stone-900 border border-amber-800 rounded-xl">
              <p className="text-amber-400 font-bold">{sp.pos[k]}: {DECK[i].n} ({DECK[i].hi}){rev[i] ? ' · उल्टा' : ''}</p>
              <p className="text-stone-300 mt-1">{rev[i] ? TAROT_REV : DECK[i].up}</p>
            </div>
          ))}
          <div className={card}>
            <p className="text-stone-200">आपकी रीडिंग आपके नाम, जन्म तिथि, सवाल और इन कार्ड्स के आधार पर तैयार होती है।</p>
            <button onClick={() => deepReading()} disabled={busy} className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold rounded-lg cursor-pointer">{busy ? 'रीडिंग हो रही है…' : '🔄 रीडिंग दोबारा पाएँ'}</button>
            {err && (
              <div className="mt-2 p-3 rounded-lg bg-red-950/60 border border-red-700">
                <p className="text-red-200 font-bold">{err}</p>
                {(err.includes('वॉलेट') || err.includes('लॉगिन')) && (
                  <button onClick={() => onNeed(err.includes('लॉगिन') ? 'login_required' : 'need_credits')} className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer">
                    {err.includes('लॉगिन') ? '📱 लॉगिन करें' : '💰 वॉलेट रिचार्ज करें'}
                  </button>
                )}
              </div>
            )}
            {busy && !ai && <p className="mt-2 text-amber-300">आपकी रीडिंग तैयार हो रही है…</p>}
            {ai && <div className="mt-2 p-3 bg-stone-950 border border-amber-800 rounded-lg whitespace-pre-line text-stone-100">{ai}</div>}
          </div>
          <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-1">
            <p className="font-bold text-amber-400">उपाय (क्रम से)</p>
            <p className="text-stone-100">1. रुद्राक्ष पहनें: <strong>{R.rudraksha}</strong></p>
            <p className="text-stone-200">2. रत्न: <strong>{R.stone}</strong></p>
            <p className="text-stone-200">3. पूजा: <strong>{R.puja}</strong></p>
            <div className="flex gap-2 pt-1 flex-wrap">
              <button onClick={onBuy} className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">रुद्राक्ष देखें</button>
              <a href={generateWhatsAppUrl('919131805622', `प्रणाम, मुझे ${R.puja} करानी है। कृपया जानकारी दें।`)} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">पूजा बुक करें (WhatsApp)</a>
            </div>
          </div>
          <p className="text-stone-400">ज़्यादा जानकारी या विस्तृत परामर्श के लिए <a className="text-emerald-400 underline" href={generateWhatsAppUrl('919131805622', 'प्रणाम, मुझे अपनी टैरो रीडिंग के बारे में विस्तार से जानना है।')} target="_blank" rel="noreferrer">कान्हा असा को WhatsApp करें</a>। पहली रीडिंग फ्री है, उसके बाद लॉगिन करके वॉलेट में पैसे डालकर पूछ सकते हैं।</p>
          <button onClick={() => reset()} className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold cursor-pointer">🔁 नई रीडिंग</button>
        </div>
      )}
    </div>
  );
};
