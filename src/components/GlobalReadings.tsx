import React, { useState } from 'react';
import { calculateGlobalReading, nineStarKi, charmFor, BLOOD, PALM, FACE, REMEDY, LOVE } from '../utils/global';
import { readPhoto, askAstrologer, getToken, reasonText } from '../utils/kanhaApi';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { TarotReader } from './TarotReader';

type Sub = 'dob' | 'tarot' | 'palm' | 'face' | 'love';
const card = 'p-3 bg-stone-900 border border-stone-800 rounded-xl';
const sel = 'w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400';
const WA = '919131805622';

// Remedies are always shown in this priority: 1) Rudraksha  2) Gemstone  3) Puja
const Remedy: React.FC<{ rudraksha: string; stone: string; puja: string; onBuy: () => void }> = ({ rudraksha, stone, puja, onBuy }) => (
  <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-1">
    <p className="font-bold text-amber-400">उपाय (क्रम से)</p>
    <p className="text-stone-100">1. रुद्राक्ष पहनें: <strong>{rudraksha}</strong></p>
    <p className="text-stone-200">2. रत्न: <strong>{stone}</strong></p>
    <p className="text-stone-200">3. पूजा: <strong>{puja}</strong></p>
    <div className="flex gap-2 pt-1 flex-wrap">
      <button onClick={onBuy} className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">रुद्राक्ष देखें</button>
      <a href={generateWhatsAppUrl(WA, `प्रणाम, मुझे ${puja} करानी है। कृपया जानकारी दें।`)} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">पूजा बुक करें (WhatsApp)</a>
    </div>
  </div>
);

const resizeImage = (file: File): Promise<{ data: string; mime: string }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1024;
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * r);
      c.height = Math.round(img.height * r);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve({ data: c.toDataURL('image/jpeg', 0.8), mime: 'image/jpeg' });
    };
    img.onerror = () => reject(new Error('img'));
    img.src = url;
  });

const PhotoReader: React.FC<{ kind: 'hand' | 'face'; onNeed: (reason: string) => void }> = ({ kind, onNeed }) => {
  const [preview, setPreview] = useState('');
  const [mime, setMime] = useState('image/jpeg');
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState('');
  const [err, setErr] = useState('');
  const label = kind === 'hand' ? 'हथेली' : 'चेहरे';

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnswer('');
    setErr('');
    try {
      const r = await resizeImage(file);
      setPreview(r.data);
      setMime(r.mime);
    } catch {
      setErr('फ़ोटो खुल नहीं पाई, दूसरी फ़ोटो चुनें।');
    }
  };

  const read = async () => {
    if (!getToken()) return onNeed('login_required');
    setBusy(true);
    setErr('');
    setAnswer('');
    const r = await readPhoto(kind, preview, mime, '');
    setBusy(false);
    if (r.ok && r.answer) return setAnswer(String(r.answer));
    if (r.reason === 'login_required' || r.reason === 'need_credits') return onNeed(r.reason);
    setErr(reasonText(r.reason));
  };

  return (
    <div className={`${card} space-y-3`}>
      <p className="font-bold text-white">📷 फ़ोटो से रीडिंग (AI)</p>
      <p className="text-stone-400">अच्छी रोशनी में {label} की साफ़ फ़ोटो लें या गैलरी से चुनें।</p>
      <div className="flex gap-2 flex-wrap">
        <label className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">
          कैमरा से खींचें
          <input type="file" accept="image/*" capture={kind === 'face' ? 'user' : 'environment'} onChange={pick} className="hidden" />
        </label>
        <label className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold cursor-pointer">
          गैलरी से चुनें
          <input type="file" accept="image/*" onChange={pick} className="hidden" />
        </label>
      </div>
      {preview && (
        <div className="space-y-2">
          <img src={preview} alt="preview" className="max-h-56 rounded-lg border border-stone-700 mx-auto" />
          <button onClick={read} disabled={busy} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold rounded-lg cursor-pointer">
            {busy ? 'रीडिंग हो रही है…' : 'रीडिंग पाएँ'}
          </button>
        </div>
      )}
      {err && <p className="text-red-300">{err}</p>}
      {answer && <div className="p-3 bg-stone-950 border border-amber-800 rounded-lg whitespace-pre-line text-stone-100">{answer}</div>}
      <p className="text-[12px] text-stone-500">फ़ोटो सिर्फ़ रीडिंग के लिए भेजी जाती है। पहले लॉगिन करना होगा, शुरुआती सवाल फ्री हैं।</p>
    </div>
  );
};

export const GlobalReadings: React.FC<{ onClose: () => void; onNeed: (reason: string) => void }> = ({ onClose, onNeed }) => {
  const [sub, setSub] = useState<Sub>('dob');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [blood, setBlood] = useState('');
  const [palm, setPalm] = useState<Record<string, string>>({});
  const [face, setFace] = useState('');
  const [love, setLove] = useState('');
  const [loveStatus, setLoveStatus] = useState('');
  const [loveText, setLoveText] = useState('');
  const [loveAi, setLoveAi] = useState('');
  const [loveBusy, setLoveBusy] = useState(false);
  const [loveErr, setLoveErr] = useState('');
  const askLove = async () => {
    if (!getToken()) return onNeed('login_required');
    setLoveBusy(true); setLoveErr(''); setLoveAi('');
    const l = LOVE.find((x) => x.v === love);
    const msg = `[LOVE-LIFE PROBLEM - recommend ONLY pujas (Mangal Gauri Puja first; also Gauri Shankar / Shukra Shanti / Guru Shanti as suitable). Do NOT recommend Rudraksha or gemstones for this.] Problem type: ${l?.hi || 'not selected'}. Relationship status: ${loveStatus || 'not told'}. Customer says: ${loveText}`;
    const r = await askAstrologer(msg, []);
    setLoveBusy(false);
    if (r.ok && r.answer) return setLoveAi(String(r.answer));
    if (r.reason === 'login_required' || r.reason === 'need_credits') return onNeed(r.reason);
    setLoveErr(reasonText(r.reason));
  };

  const g = dob ? calculateGlobalReading(dob) : null;
  const ki = dob ? nineStarKi(dob, gender) : null;
  const ch = g ? charmFor(g.lifePath) : undefined;

  const buy = () => {
    onClose();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };
  const tab = (k: Sub, l: string) => (
    <button key={k} onClick={() => setSub(k)} className={`flex-1 px-2 py-1.5 rounded-lg border text-[13px] font-semibold cursor-pointer ${sub === k ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-950 border-stone-700 text-stone-300'}`}>{l}</button>
  );

  const palmRemedy = () => {
    const R = palm.heart === 'chain' || palm.heart === 'curve' ? REMEDY.love : palm.fate === 'broken' || palm.fate === 'none' ? REMEDY.change : palm.head ? REMEDY.career : REMEDY.peace;
    return <Remedy rudraksha={R.rudraksha} stone={R.stone} puja={R.puja} onBuy={buy} />;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950 text-xs">
      <div className="flex gap-2 flex-wrap">
        {tab('dob', 'जन्म तिथि')}{tab('tarot', 'टैरो कार्ड')}{tab('palm', 'हस्त रेखा')}{tab('face', 'चेहरा')}{tab('love', 'लव लाइफ')}
      </div>

      {sub === 'dob' && (
        <div className="space-y-3">
          <div className={`${card} space-y-3`}>
            <label className="block font-semibold text-stone-300">जन्म तिथि (Date of Birth) *</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${sel} font-mono`} />
            <div className="grid grid-cols-2 gap-3">
              <select value={gender} onChange={(e) => setGender(e.target.value as 'M' | 'F')} className={sel}>
                <option value="M">पुरुष</option>
                <option value="F">महिला</option>
              </select>
              <select value={blood} onChange={(e) => setBlood(e.target.value)} className={sel}>
                <option value="">ब्लड ग्रुप (वैकल्पिक)</option>
                {Object.keys(BLOOD).map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <p className="text-[13px] text-stone-400">भारत, चीन, जापान, पश्चिम, बर्मा और मिस्र की परंपराओं से एक साथ रीडिंग।</p>
          </div>
          {g && ch && (
            <>
              <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl">
                <p className="font-bold text-amber-400">आपका ग्लोबल सारांश: Life Path {g.lifePath}</p>
                <p className="text-stone-200 mt-1">{g.lifePathInfo.hi} ({g.lifePathInfo.en})</p>
                <p className="text-stone-100 mt-2">1. रुद्राक्ष पहनें: <strong>{g.lifePathInfo.rudraksha}</strong></p>
                <p className="text-stone-200">2. रत्न: <strong>{ch.crystal}</strong></p>
                <p className="text-stone-200">3. पूजा: <strong>{ch.puja}</strong></p>
                <p className="text-stone-400 mt-1">चक्र: {ch.chakra} · प्रतीक/ताबीज़: {ch.charm}</p>
                <div className="flex gap-2 pt-2 flex-wrap">
                  <button onClick={buy} className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">रुद्राक्ष देखें</button>
                  <a href={generateWhatsAppUrl(WA, `प्रणाम, मुझे ${ch.puja} करानी है। कृपया जानकारी दें।`)} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">पूजा बुक करें (WhatsApp)</a>
                </div>
              </div>
              <div className={card}><p className="font-bold text-white">पश्चिमी Sun Sign: {g.sunSign.en} ({g.sunSign.hi})</p></div>
              <div className={card}>
                <p className="font-bold text-white">Chinese Zodiac: {g.chinese.en} ({g.chinese.hi})</p>
                <p className="text-stone-400 mt-1">जनवरी-फरवरी के जन्म में चीनी नव वर्ष के हिसाब से पिछला जानवर हो सकता है।</p>
              </div>
              {ki && <div className={card}><p className="font-bold text-white">जापानी Nine Star Ki: {ki}</p></div>}
              <div className={card}>
                <p className="font-bold text-white">बर्मी जन्म-वार: {g.burmese.day}</p>
                <p className="text-stone-200 mt-1">जानवर: {g.burmese.animal}</p>
                <p className="text-stone-400 mt-1">ग्रह: {g.burmese.planet} · दिशा: {g.burmese.dir}</p>
              </div>
              {blood && <div className={card}><p className="font-bold text-white">जापानी ब्लड-टाइप ({blood})</p><p className="text-stone-300 mt-1">{BLOOD[blood]}</p></div>}
            </>
          )}
        </div>
      )}

      {sub === 'tarot' && <TarotReader onBuy={buy} onNeed={onNeed} />}

      {sub === 'palm' && (
        <div className="space-y-3">
          <PhotoReader kind="hand" onNeed={onNeed} />
          <p className="text-stone-400">या खुद अपनी हथेली देखकर हर रेखा का रूप चुनें।</p>
          {PALM.map((l) => (
            <div key={l.key} className={card}>
              <p className="font-bold text-white mb-2">{l.title}</p>
              <select value={palm[l.key] || ''} onChange={(e) => setPalm({ ...palm, [l.key]: e.target.value })} className={sel}>
                <option value="">चुनें</option>
                {l.opts.map((o) => <option key={o.v} value={o.v}>{o.hi}</option>)}
              </select>
              {palm[l.key] && <p className="text-amber-300 mt-2">{l.opts.find((o) => o.v === palm[l.key])?.r}</p>}
            </div>
          ))}
          {Object.keys(palm).length > 0 && palmRemedy()}
        </div>
      )}

      {sub === 'face' && (
        <div className="space-y-3">
          <PhotoReader kind="face" onNeed={onNeed} />
          <p className="text-stone-400">या चीनी Mian Xiang के पाँच तत्वों में से अपना चेहरा चुनें।</p>
          <div className={card}>
            <select value={face} onChange={(e) => setFace(e.target.value)} className={sel}>
              <option value="">चेहरे का आकार चुनें</option>
              {FACE.map((f) => <option key={f.v} value={f.v}>{f.hi}</option>)}
            </select>
            {face && (() => {
              const f = FACE.find((x) => x.v === face)!;
              const R = REMEDY[f.rem];
              return (
                <div className="mt-2 space-y-2">
                  <p className="text-stone-200">{f.r}</p>
                  <Remedy rudraksha={`${f.rudraksha} रुद्राक्ष`} stone={R.stone} puja={R.puja} onBuy={buy} />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {sub === 'love' && (
        <div className="space-y-3">
          <p className="text-stone-400">अपनी लव लाइफ की समस्या चुनें। इसमें सिर्फ़ पूजा का सुझाव दिया जाता है।</p>
          <div className={`${card} space-y-2`}>
            <select value={love} onChange={(e) => setLove(e.target.value)} className={sel}>
              <option value="">1. मुख्य समस्या चुनें</option>
              {LOVE.map((l) => <option key={l.v} value={l.v}>{l.hi}</option>)}
            </select>
            <select value={loveStatus} onChange={(e) => setLoveStatus(e.target.value)} className={sel}>
              <option value="">2. आपकी स्थिति</option>
              <option>रिलेशनशिप में हूँ</option>
              <option>विवाहित हूँ</option>
              <option>सगाई / शादी तय है</option>
              <option>ब्रेकअप हो चुका है</option>
              <option>अभी कोई साथी नहीं, रिश्ता चाहिए</option>
            </select>
            <textarea value={loveText} onChange={(e) => setLoveText(e.target.value)} rows={3} className={sel} placeholder="3. अपनी समस्या अपने शब्दों में लिखें: क्या हो रहा है, कब से, क्या चाहते हैं?" />
            <button onClick={askLove} disabled={loveBusy || (!love && !loveText.trim())} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-lg cursor-pointer">{loveBusy ? 'देख रहे हैं…' : '💬 AI आचार्य से अपनी समस्या पर बात करें'}</button>
            {loveErr && <p className="text-red-300">{loveErr}</p>}
            {loveAi && <div className="p-3 bg-stone-950 border border-amber-800 rounded-lg whitespace-pre-line text-stone-100">{loveAi}</div>}
          </div>
          {love && (() => {
            const l = LOVE.find((x) => x.v === love)!;
            return (
              <div className="p-3 bg-stone-900 border border-amber-700 rounded-xl space-y-2">
                <p className="font-bold text-amber-400">आपके लिए सुझाई गई पूजा</p>
                {l.pujas.map((p, k) => (
                  <div key={p.name}>
                    <p className="text-stone-100">{k + 1}. <strong>{p.name}</strong></p>
                    <p className="text-stone-400 pl-4">{p.why}</p>
                  </div>
                ))}
                <a href={generateWhatsAppUrl(WA, `प्रणाम, मेरी समस्या: ${l.hi}। मुझे ${l.pujas[0].name} के बारे में जानकारी चाहिए।`)} target="_blank" rel="noreferrer" className="inline-block mt-1 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold">पूजा बुक करें (WhatsApp)</a>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
