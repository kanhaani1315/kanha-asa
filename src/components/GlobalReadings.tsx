import React, { useState } from 'react';
import { calculateGlobalReading, nineStarKi, charmFor, BLOOD, TAROT, TAROT_REV, PALM, FACE } from '../utils/global';

type Sub = 'dob' | 'tarot' | 'palm' | 'face';
const card = 'p-3 bg-stone-900 border border-stone-800 rounded-xl';

export const GlobalReadings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [sub, setSub] = useState<Sub>('dob');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [blood, setBlood] = useState('');
  const [draw, setDraw] = useState<{ i: number; rev: boolean }[] | null>(null);
  const [palm, setPalm] = useState<Record<string, string>>({});
  const [face, setFace] = useState('');

  const g = dob ? calculateGlobalReading(dob) : null;
  const ki = dob ? nineStarKi(dob, gender) : null;
  const ch = g ? charmFor(g.lifePath) : undefined;

  const shuffle = () => {
    const idx = Array.from({ length: TAROT.length }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, 3);
    setDraw(idx.map((i) => ({ i, rev: Math.random() < 0.3 })));
  };
  const buy = () => { onClose(); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); };
  const tab = (k: Sub, l: string) => (
    <button key={k} onClick={() => setSub(k)} className={`flex-1 px-2 py-1.5 rounded-lg border text-[13px] font-semibold cursor-pointer ${sub === k ? 'bg-amber-600 border-amber-500 text-white' : 'bg-stone-950 border-stone-700 text-stone-300'}`}>{l}</button>
  );
  const sel = 'w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-xs text-stone-100 focus:outline-none focus:border-amber-400';
  const pos = ['अतीत (Past)', 'वर्तमान (Present)', 'भविष्य (Future)'];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950 text-xs">
      <div className="flex gap-2">{tab('dob', 'जन्म तिथि')}{tab('tarot', 'टैरो कार्ड')}{tab('palm', 'हस्त रेखा')}{tab('face', 'चेहरा')}</div>

      {sub === 'dob' && (
        <div className="space-y-3">
          <div className={`${card} space-y-3`}>
            <label className="block font-semibold text-stone-300">जन्म तिथि (Date of Birth) *</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`${sel} font-mono`} />
            <div className="grid grid-cols-2 gap-3">
              <select value={gender} onChange={(e) => setGender(e.target.value as 'M' | 'F')} className={sel}>
                <option value="M">पुरुष</option><option value="F">महिला</option>
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
                <p className="font-bold text-amber-400">आपका ग्लोबल सारांश</p>
                <p className="text-stone-200 mt-1">Life Path {g.lifePath}: {g.lifePathInfo.hi}</p>
                <p className="text-amber-300 mt-1">रुद्राक्ष: <strong>{g.lifePathInfo.rudraksha}</strong> · रत्न: <strong>{ch.crystal}</strong></p>
                <p className="text-stone-300 mt-1">चक्र: {ch.chakra} · प्रतीक/ताबीज़: {ch.charm}</p>
                <button onClick={buy} className="mt-2 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">Buy on Kanhaasa.com</button>
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

      {sub === 'tarot' && (
        <div className="space-y-3">
          <div className={card}>
            <p className="text-stone-300">अपने सवाल पर ध्यान लगाएँ और कार्ड चुनें: अतीत, वर्तमान और भविष्य।</p>
            <button onClick={shuffle} className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg cursor-pointer">🔮 कार्ड खींचें</button>
          </div>
          {draw && draw.map((d, k) => (
            <div key={k} className="p-3 bg-stone-900 border border-amber-800 rounded-xl">
              <p className="text-amber-400 font-bold">{pos[k]}</p>
              <p className="text-white font-bold mt-0.5">{TAROT[d.i].n} ({TAROT[d.i].hi}){d.rev ? ' · उल्टा' : ''}</p>
              <p className="text-stone-300 mt-1">{d.rev ? TAROT_REV : TAROT[d.i].up}</p>
            </div>
          ))}
          {draw && <button onClick={buy} className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">Buy on Kanhaasa.com</button>}
        </div>
      )}

      {sub === 'palm' && (
        <div className="space-y-3">
          <p className="text-stone-400">अपनी दाईं (या सक्रिय) हथेली देखकर हर रेखा का रूप चुनें।</p>
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
        </div>
      )}

      {sub === 'face' && (
        <div className="space-y-3">
          <p className="text-stone-400">चीनी Mian Xiang के पाँच तत्वों में से अपना चेहरा चुनें।</p>
          <div className={card}>
            <select value={face} onChange={(e) => setFace(e.target.value)} className={sel}>
              <option value="">चेहरे का आकार चुनें</option>
              {FACE.map((f) => <option key={f.v} value={f.v}>{f.hi}</option>)}
            </select>
            {face && (() => { const f = FACE.find((x) => x.v === face)!; return (
              <div className="mt-2"><p className="text-stone-200">{f.r}</p><p className="text-amber-300 mt-1">सुझाया रुद्राक्ष: <strong>{f.rudraksha}</strong></p>
              <button onClick={buy} className="mt-2 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold cursor-pointer">Buy on Kanhaasa.com</button></div>
            ); })()}
          </div>
        </div>
      )}
    </div>
  );
};
