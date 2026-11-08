import * as Astronomy from 'astronomy-engine';

export const SIGNS = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'];
const LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
export const PHI: Record<string, string> = { Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' };
const LAHIRI_J2000 = 23.8531;

const mod = (x: number, m = 360) => ((x % m) + m) % m;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export interface Chart {
  lagnaSign: number;                      // 0-11 (sign index of reference lagna)
  usingMoon: boolean;                     // true when birth time unknown -> Chandra kundli
  planets: Record<string, { sign: number; house: number; lon: number }>;
}

export function buildChart(date: string, time: string | null, tz: number, lat: number, lon: number): Chart | null {
  const [y, m, d] = date.split('-').map(Number);
  if ([y, m, d].some(isNaN)) return null;
  const [hh, mm] = (time || '12:00').split(':').map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - tz * 3600 * 1000;
  const t = new Date(utcMs);
  const T = (utcMs - Date.UTC(2000, 0, 1, 12, 0)) / (36525 * 86400 * 1000);
  const ayan = LAHIRI_J2000 + 1.3969713 * T;

  const sid: Record<string, number> = {};
  const bodies: [string, Astronomy.Body][] = [['Sun', Astronomy.Body.Sun], ['Moon', Astronomy.Body.Moon], ['Mars', Astronomy.Body.Mars], ['Mercury', Astronomy.Body.Mercury], ['Jupiter', Astronomy.Body.Jupiter], ['Venus', Astronomy.Body.Venus], ['Saturn', Astronomy.Body.Saturn]];
  for (const [k, b] of bodies) {
    const v = Astronomy.GeoVector(b, t, true);
    sid[k] = mod(Astronomy.Ecliptic(v).elon - LAHIRI_J2000);
  }
  const rahuTrop = mod(125.04452 - 1934.136261 * T);
  sid.Rahu = mod(rahuTrop - ayan);
  sid.Ketu = mod(sid.Rahu + 180);

  let lagnaSign: number;
  const usingMoon = !time;
  if (usingMoon) {
    lagnaSign = Math.floor(sid.Moon / 30);
  } else {
    const gast = Astronomy.SiderealTime(t); // hours
    const ramc = mod(gast * 15 + lon);
    const eps = 23.4392911 - 0.0130042 * T;
    const asc = mod(deg(Math.atan2(Math.cos(rad(ramc)), -(Math.sin(rad(ramc)) * Math.cos(rad(eps)) + Math.tan(rad(lat)) * Math.sin(rad(eps))))));
    lagnaSign = Math.floor(mod(asc - ayan) / 30);
  }
  const planets: Chart['planets'] = {};
  for (const k of Object.keys(sid)) {
    const sign = Math.floor(sid[k] / 30);
    planets[k] = { sign, house: mod(sign - lagnaSign, 12) + 1, lon: sid[k] };
  }
  return { lagnaSign, usingMoon, planets };
}

// aspect (Vedic drishti) of planet in house P on house H
const ASPECTS: Record<string, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7],
  Mars: [4, 7, 8], Jupiter: [5, 7, 9], Saturn: [3, 7, 10], Rahu: [5, 7, 9], Ketu: [5, 7, 9],
};
const aspects = (planet: string, pHouse: number, h: number) => ASPECTS[planet].includes(mod(h - pHouse, 12) + 1);
const MALEFIC = ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'];
const DUSTHANA = [6, 8, 12];

export interface Finding { ok: boolean; text: string }
export interface Analysis {
  seventhSign: number; seventhLord: string; lordHouse: number;
  findings: Finding[]; manglik: boolean; delayHint: boolean;
  pujas: { name: string; why: string }[];
}

export function analyzeSeventh(c: Chart): Analysis {
  const p = c.planets;
  const sign7 = mod(c.lagnaSign + 6, 12);
  const lord = LORD[sign7];
  const lordH = p[lord].house;
  const f: Finding[] = [];
  const pujas: { name: string; why: string }[] = [];
  const ref = c.usingMoon ? 'चंद्र' : 'लग्न';

  f.push({ ok: true, text: `सप्तम भाव (जीवनसाथी/विवाह) ${SIGNS[sign7]} राशि का है, इसके स्वामी ${PHI[lord]} हैं।` });

  const lordBad = DUSTHANA.includes(lordH);
  if (lordBad) {
    f.push({ ok: false, text: `सप्तमेश ${PHI[lord]} ${lordH}वें भाव (दुःस्थान) में बैठे हैं। इससे विवाह/रिश्ते में विलंब, रुकावट या उतार-चढ़ाव का कारण बनता है।` });
    pujas.push({ name: 'सप्तम भाव / सप्तमेश शांति पूजा', why: `सप्तमेश ${PHI[lord]} ${lordH}वें भाव में पीड़ित हैं।` });
  } else {
    f.push({ ok: true, text: `सप्तमेश ${PHI[lord]} ${lordH}वें भाव में हैं, जो दुःस्थान नहीं है। यह रिश्ते के लिए अच्छा संकेत है।` });
  }

  const inSeventh = Object.keys(p).filter((k) => p[k].house === 7);
  if (inSeventh.length) {
    const mal = inSeventh.filter((k) => MALEFIC.includes(k));
    f.push({ ok: mal.length === 0, text: `सप्तम भाव में ${inSeventh.map((k) => PHI[k]).join(', ')} बैठे हैं${mal.length ? ' (पाप/क्रूर प्रभाव)' : ''}।` });
  }

  const afflict = Object.keys(p).filter((k) => MALEFIC.includes(k) && p[k].house !== 7 && aspects(k, p[k].house, 7));
  if (afflict.length) {
    f.push({ ok: false, text: `सप्तम भाव पर ${afflict.map((k) => PHI[k]).join(', ')} की दृष्टि है। पापी/क्रूर ग्रहों की दृष्टि से रिश्ते में तनाव, देरी या भ्रम आता है।` });
  }
  const benefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].filter((k) => p[k].house !== 7 && aspects(k, p[k].house, 7));
  if (benefic.length) f.push({ ok: true, text: `सप्तम भाव पर ${benefic.map((k) => PHI[k]).join(', ')} की शुभ दृष्टि है, जो सहारा देती है।` });

  const kruur = Array.from(new Set([...inSeventh.filter((k) => MALEFIC.includes(k)), ...afflict]));
  if (kruur.length) pujas.push({ name: 'क्रूर ग्रह शांति पूजा', why: `${kruur.map((k) => PHI[k]).join(', ')} का सप्तम भाव पर प्रभाव शांत करने के लिए।` });

  const mars = p.Mars.house;
  const manglik = [1, 2, 4, 7, 8, 12].includes(mars);
  if (manglik) {
    f.push({ ok: false, text: `मंगल ${ref} से ${mars}वें भाव में है, इसलिए मांगलिक दोष बनता है। इससे विवाह में देरी या आपसी टकराव हो सकता है।` });
    pujas.unshift({ name: 'मांगलिक दोष शांति पूजा', why: `मंगल ${mars}वें भाव में है।` });
  } else {
    f.push({ ok: true, text: `मंगल ${mars}वें भाव में है, मांगलिक दोष नहीं बन रहा।` });
  }

  const ven = p.Venus;
  const venBad = DUSTHANA.includes(ven.house) || ['Saturn', 'Rahu', 'Ketu', 'Mars'].some((k) => p[k].sign === ven.sign);
  if (venBad) {
    f.push({ ok: false, text: 'प्रेम के कारक शुक्र पर दबाव है (दुःस्थान में या पाप ग्रह के साथ)। प्रेम और आकर्षण में कमी या उलझन का संकेत।' });
    pujas.push({ name: 'शुक्र ग्रह शांति पूजा', why: 'प्रेम के कारक शुक्र को बल देने के लिए।' });
  }

  const sat = p.Saturn;
  const delay = sat.house === 7 || aspects('Saturn', sat.house, 7) || p[lord].sign === sat.sign || (lord === 'Saturn');
  if (delay && lord !== 'Saturn') f.push({ ok: false, text: 'शनि का संबंध सप्तम भाव/सप्तमेश से है, जो रिश्ते या विवाह में देरी का मुख्य कारण माना जाता है।' });

  const sign9 = mod(c.lagnaSign + 8, 12);
  const lord9 = LORD[sign9];
  const h9 = p[lord9].house;
  const mal9 = Object.keys(p).filter((k) => p[k].house === 9 && MALEFIC.includes(k));
  if (DUSTHANA.includes(h9) || mal9.length) {
    f.push({ ok: false, text: `नवम भाव (भाग्य भाव) कमज़ोर है${DUSTHANA.includes(h9) ? `: नवमेश ${PHI[lord9]} ${h9}वें भाव में` : ''}${mal9.length ? `, ${mal9.map((k) => PHI[k]).join(', ')} नवम में` : ''}। भाग्य का साथ कम मिलने से सही समय पर रिश्ता नहीं बन पाता।` });
    pujas.push({ name: 'नवम भाव (भाग्य भाव) पूजा', why: 'भाग्य का समर्थन बढ़ाने के लिए।' });
  }

  pujas.push({ name: 'मंगल गौरी पूजा', why: 'विवाह और रिश्ते की बाधा दूर करने की मुख्य पूजा।' });
  const seen = new Set<string>();
  const uniq = pujas.filter((x) => (seen.has(x.name) ? false : (seen.add(x.name), true)));
  return { seventhSign: sign7, seventhLord: lord, lordHouse: lordH, findings: f, manglik, delayHint: !!delay, pujas: uniq };
}

export async function geocode(place: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`, { headers: { Accept: 'application/json' } });
    const j = await r.json();
    if (!j?.length) return null;
    return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon), name: j[0].display_name };
  } catch {
    return null;
  }
}
