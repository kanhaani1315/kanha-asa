// Global readings from Date of Birth: Pythagorean Life Path, Western Sun sign,
// Chinese Zodiac and Burmese (Mahabote-style) birth-day animal.

const reduce = (n: number, keepMaster = true): number => {
  while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0);
  }
  return n;
};

const LIFE_PATH: Record<number, { hi: string; en: string; rudraksha: string }> = {
  1: { hi: 'नेतृत्व, आत्मविश्वास और नई शुरुआत', en: 'Leader / Pioneer', rudraksha: '12 मुखी (सूर्य)' },
  2: { hi: 'रिश्ते, सहयोग और भावनात्मक संतुलन', en: 'Peacemaker', rudraksha: '2 मुखी (चंद्र)' },
  3: { hi: 'वाणी, रचनात्मकता और ज्ञान', en: 'Creative / Communicator', rudraksha: '5 मुखी (गुरु)' },
  4: { hi: 'स्थिरता, अनुशासन और मेहनत', en: 'Builder', rudraksha: '8 मुखी (राहु)' },
  5: { hi: 'बदलाव, व्यापार और धन का प्रवाह', en: 'Free spirit / Trader', rudraksha: '4 मुखी (बुध)' },
  6: { hi: 'परिवार, प्रेम और सुख-सुविधा', en: 'Nurturer', rudraksha: '6 मुखी (शुक्र)' },
  7: { hi: 'ध्यान, अध्यात्म और गहरी सोच', en: 'Seeker / Mystic', rudraksha: '9 मुखी (केतु)' },
  8: { hi: 'करियर, अधिकार और धन', en: 'Achiever', rudraksha: '7 मुखी (शनि)' },
  9: { hi: 'ऊर्जा, साहस और सेवा', en: 'Humanitarian', rudraksha: '3 मुखी (मंगल)' },
  11: { hi: 'मास्टर 11: अंतर्ज्ञान और प्रेरणा', en: 'Master Intuitive', rudraksha: '2 मुखी (चंद्र)' },
  22: { hi: 'मास्टर 22: बड़े सपने साकार करने की शक्ति', en: 'Master Builder', rudraksha: '8 मुखी (राहु)' },
  33: { hi: 'मास्टर 33: करुणा और मार्गदर्शन', en: 'Master Teacher', rudraksha: '6 मुखी (शुक्र)' },
};

const SUN_SIGNS = [
  { m: 1, d: 20, hi: 'कुंभ', en: 'Aquarius' }, { m: 2, d: 19, hi: 'मीन', en: 'Pisces' },
  { m: 3, d: 21, hi: 'मेष', en: 'Aries' }, { m: 4, d: 20, hi: 'वृषभ', en: 'Taurus' },
  { m: 5, d: 21, hi: 'मिथुन', en: 'Gemini' }, { m: 6, d: 21, hi: 'कर्क', en: 'Cancer' },
  { m: 7, d: 23, hi: 'सिंह', en: 'Leo' }, { m: 8, d: 23, hi: 'कन्या', en: 'Virgo' },
  { m: 9, d: 23, hi: 'तुला', en: 'Libra' }, { m: 10, d: 23, hi: 'वृश्चिक', en: 'Scorpio' },
  { m: 11, d: 22, hi: 'धनु', en: 'Sagittarius' }, { m: 12, d: 22, hi: 'मकर', en: 'Capricorn' },
];

const CHINESE = [
  ['बंदर', 'Monkey'], ['मुर्गा', 'Rooster'], ['कुत्ता', 'Dog'], ['सूअर', 'Pig'],
  ['चूहा', 'Rat'], ['बैल', 'Ox'], ['बाघ', 'Tiger'], ['खरगोश', 'Rabbit'],
  ['ड्रैगन', 'Dragon'], ['साँप', 'Snake'], ['घोड़ा', 'Horse'], ['बकरी', 'Goat'],
];

// Burmese weekday: animal, planet, direction
const BURMESE = [
  { day: 'रविवार', animal: 'गरुड़ (Garuda)', planet: 'सूर्य', dir: 'उत्तर-पूर्व' },
  { day: 'सोमवार', animal: 'बाघ (Tiger)', planet: 'चंद्र', dir: 'पूर्व' },
  { day: 'मंगलवार', animal: 'सिंह (Lion)', planet: 'मंगल', dir: 'दक्षिण-पूर्व' },
  { day: 'बुधवार', animal: 'हाथी (Elephant); दोपहर बाद जन्म: बिना दाँत का हाथी (राहु)', planet: 'बुध / राहु', dir: 'दक्षिण / उत्तर-पश्चिम' },
  { day: 'गुरुवार', animal: 'चूहा (Rat)', planet: 'गुरु', dir: 'पश्चिम' },
  { day: 'शुक्रवार', animal: 'गिनी पिग (Guinea pig)', planet: 'शुक्र', dir: 'उत्तर' },
  { day: 'शनिवार', animal: 'नाग/ड्रैगन (Naga)', planet: 'शनि', dir: 'दक्षिण-पश्चिम' },
];

export interface GlobalReading {
  lifePath: number; lifePathInfo: { hi: string; en: string; rudraksha: string };
  sunSign: { hi: string; en: string };
  chinese: { hi: string; en: string };
  burmese: { day: string; animal: string; planet: string; dir: string };
}

export function calculateGlobalReading(dateStr: string): GlobalReading | null {
  const p = dateStr.split('-').map(Number);
  if (p.length !== 3 || p.some(isNaN)) return null;
  const [y, m, d] = p;
  const lifePath = reduce(reduce(d) + reduce(m) + reduce(y));
  let sun = SUN_SIGNS[11];
  for (let i = 0; i < 12; i++) {
    const s = SUN_SIGNS[i];
    const next = SUN_SIGNS[(i + 1) % 12];
    const afterStart = m > s.m || (m === s.m && d >= s.d);
    const beforeNext = i === 11 ? true : (m < next.m || (m === next.m && d < next.d));
    if (afterStart && beforeNext) sun = s;
  }
  if (m === 1 && d < 20) sun = SUN_SIGNS[11];
  const c = CHINESE[y % 12];
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return {
    lifePath, lifePathInfo: LIFE_PATH[lifePath],
    sunSign: { hi: sun.hi, en: sun.en },
    chinese: { hi: c[0], en: c[1] },
    burmese: BURMESE[wd],
  };
}
