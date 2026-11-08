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

// ---------- Nine Star Ki (Japan) ----------
const KI_NAMES = ['', '1 जल (Water)', '2 पृथ्वी (Soil)', '3 वृक्ष-गरज (Tree)', '4 वृक्ष-हवा (Tree)', '5 पृथ्वी-केंद्र (Soil)', '6 धातु-आकाश (Metal)', '7 धातु-झील (Metal)', '8 पृथ्वी-पर्वत (Soil)', '9 अग्नि (Fire)'];
export function nineStarKi(dateStr: string, gender: 'M' | 'F'): string | null {
  const p = dateStr.split('-').map(Number);
  if (p.length !== 3 || p.some(isNaN)) return null;
  let [y, m, d] = p;
  if (m < 2 || (m === 2 && d < 4)) y -= 1; // Ki year starts ~4 Feb
  let s = String(y).split('').reduce((a, c) => a + Number(c), 0);
  while (s > 9) s = String(s).split('').reduce((a, c) => a + Number(c), 0);
  let k = gender === 'M' ? 11 - s : s + 4;
  while (k > 9) k -= 9;
  return KI_NAMES[k];
}

// ---------- Chakra / Crystal / Charm by Life Path ----------
const CHARM: Record<number, { chakra: string; crystal: string; charm: string }> = {
  1: { chakra: 'सोलर प्लेक्सस', crystal: 'Citrine / माणिक', charm: 'मिस्र का Eye of Horus' },
  2: { chakra: 'सैक्रल', crystal: 'Moonstone / मोती', charm: 'इटली का Cornicello (बुरी नज़र से बचाव)' },
  3: { chakra: 'गला (Throat)', crystal: 'Yellow Sapphire / पुखराज', charm: 'मिस्र का Ankh' },
  4: { chakra: 'मूलाधार (Root)', crystal: 'Hessonite / गोमेद', charm: 'मिस्र का Scarab' },
  5: { chakra: 'गला (Throat)', crystal: 'Emerald / पन्ना', charm: 'Eye of Horus' },
  6: { chakra: 'हृदय (Heart)', crystal: 'Rose Quartz / हीरा-ओपल', charm: 'Ankh' },
  7: { chakra: 'सहस्रार / आज्ञा', crystal: "Cat's Eye / लहसुनिया", charm: 'Scarab' },
  8: { chakra: 'मूलाधार (Root)', crystal: 'Blue Sapphire / नीलम', charm: 'Cornicello' },
  9: { chakra: 'सोलर प्लेक्सस', crystal: 'Red Coral / मूंगा', charm: 'Eye of Horus' },
  11: { chakra: 'आज्ञा (Third Eye)', crystal: 'Amethyst', charm: 'Eye of Horus' },
  22: { chakra: 'मूलाधार (Root)', crystal: 'Hessonite / गोमेद', charm: 'Scarab' },
  33: { chakra: 'हृदय (Heart)', crystal: 'Rose Quartz', charm: 'Ankh' },
};
export const charmFor = (lp: number) => CHARM[lp];

// ---------- Blood type (Japan) ----------
export const BLOOD: Record<string, string> = {
  A: 'व्यवस्थित, शांत, ज़िम्मेदार; कभी-कभी ज़्यादा चिंता करने वाले।',
  B: 'स्वतंत्र, रचनात्मक, जिज्ञासु; अपने तरीके से चलने वाले।',
  O: 'आत्मविश्वासी, नेतृत्व करने वाले, लक्ष्य पर केंद्रित।',
  AB: 'संतुलित और अलग सोच वाले; परिस्थिति के हिसाब से ढलने वाले।',
};

// ---------- Tarot (Major Arcana) ----------
export const TAROT: { n: string; hi: string; up: string }[] = [
  { n: 'The Fool', hi: 'मूर्ख', up: 'नई शुरुआत, भरोसे के साथ पहला कदम।' },
  { n: 'The Magician', hi: 'जादूगर', up: 'आपके पास ज़रूरी साधन हैं, अब कर दिखाने का समय।' },
  { n: 'The High Priestess', hi: 'महापुरोहिता', up: 'अंतर्ज्ञान पर भरोसा करें, जल्दबाज़ी न करें।' },
  { n: 'The Empress', hi: 'सम्राज्ञी', up: 'प्रेम, समृद्धि और सृजन का समय।' },
  { n: 'The Emperor', hi: 'सम्राट', up: 'अनुशासन, स्थिरता और मज़बूत नेतृत्व।' },
  { n: 'The Hierophant', hi: 'गुरु', up: 'परंपरा, मार्गदर्शन और सीखना।' },
  { n: 'The Lovers', hi: 'प्रेमी', up: 'रिश्तों में सही चुनाव और सामंजस्य।' },
  { n: 'The Chariot', hi: 'रथ', up: 'दृढ़ इच्छाशक्ति से जीत।' },
  { n: 'Strength', hi: 'शक्ति', up: 'धैर्य और भीतर का साहस।' },
  { n: 'The Hermit', hi: 'साधु', up: 'एकांत में चिंतन, भीतर की रोशनी।' },
  { n: 'Wheel of Fortune', hi: 'भाग्य चक्र', up: 'किस्मत का पलटना, बदलाव का समय।' },
  { n: 'Justice', hi: 'न्याय', up: 'सच्चाई, संतुलन और सही निर्णय।' },
  { n: 'The Hanged Man', hi: 'उल्टा लटका', up: 'रुककर नए नज़रिए से देखें।' },
  { n: 'Death', hi: 'मृत्यु', up: 'डरने की बात नहीं, पुराने का अंत और नए का आरंभ।' },
  { n: 'Temperance', hi: 'संयम', up: 'संतुलन, धैर्य और मेल-मिलाप।' },
  { n: 'The Devil', hi: 'शैतान', up: 'किसी आदत या मोह में बंधे होने का संकेत; पहचानकर मुक्त हों।' },
  { n: 'The Tower', hi: 'मीनार', up: 'अचानक बदलाव जो अंत में नींव मज़बूत करता है।' },
  { n: 'The Star', hi: 'तारा', up: 'आशा, उपचार और सकारात्मक भविष्य।' },
  { n: 'The Moon', hi: 'चंद्रमा', up: 'भ्रम या अनिश्चितता; सब कुछ साफ़ दिखने तक रुकें।' },
  { n: 'The Sun', hi: 'सूर्य', up: 'सफलता, खुशी और ऊर्जा।' },
  { n: 'Judgement', hi: 'निर्णय', up: 'आत्म-मूल्यांकन और नया अध्याय।' },
  { n: 'The World', hi: 'संसार', up: 'पूर्णता और लक्ष्य की प्राप्ति।' },
];
export const TAROT_REV = 'उल्टा होने पर: इस विषय में देरी या रुकावट, पहले अंदर झाँककर सुधार करें।';

// ---------- Palmistry (guided) ----------
export const PALM: { key: string; title: string; opts: { v: string; hi: string; r: string }[] }[] = [
  { key: 'life', title: 'जीवन रेखा (Life line)', opts: [
    { v: 'deep', hi: 'लंबी और गहरी', r: 'अच्छी जीवन-ऊर्जा और सहनशक्ति।' },
    { v: 'faint', hi: 'छोटी या हल्की', r: 'ऊर्जा का ध्यान रखें; नियमित दिनचर्या और विश्राम लाभ देते हैं।' },
    { v: 'broken', hi: 'बीच में टूटी', r: 'जीवन में बड़े बदलाव का दौर; नई दिशा के संकेत।' },
  ]},
  { key: 'heart', title: 'हृदय रेखा (Heart line)', opts: [
    { v: 'curve', hi: 'ऊपर की ओर मुड़ी हुई', r: 'भावुक और रिश्तों में खुलकर प्रेम करने वाले।' },
    { v: 'straight', hi: 'सीधी', r: 'सोच-समझकर और संयम से प्रेम करने वाले।' },
    { v: 'chain', hi: 'लहरदार या जंजीरनुमा', r: 'भावनाओं में उतार-चढ़ाव; शांत मन के उपाय लाभदायक।' },
  ]},
  { key: 'head', title: 'मस्तिष्क रेखा (Head line)', opts: [
    { v: 'long', hi: 'लंबी और सीधी', r: 'तर्क और योजना में मज़बूत।' },
    { v: 'slope', hi: 'नीचे की ओर ढलान', r: 'कल्पनाशील और रचनात्मक।' },
    { v: 'short', hi: 'छोटी', r: 'व्यावहारिक और सीधा सोचने वाले।' },
  ]},
  { key: 'fate', title: 'भाग्य रेखा (Fate line)', opts: [
    { v: 'clear', hi: 'साफ़ और स्पष्ट', r: 'करियर की दिशा स्थिर।' },
    { v: 'broken', hi: 'टूटी या कई हिस्सों में', r: 'करियर में बदलाव के चरण; नई पहल से लाभ।' },
    { v: 'none', hi: 'लगभग नहीं दिखती', r: 'अपना रास्ता खुद बनाने वाले; किसी तय ढर्रे पर नहीं चलते।' },
  ]},
];

// ---------- Face reading (five-element shapes) ----------
export const FACE: { v: string; hi: string; r: string; rudraksha: string }[] = [
  { v: 'wood', hi: 'लंबा चेहरा (काष्ठ तत्व)', r: 'योजनाकार, बढ़ने की चाह, दृढ़ संकल्प।', rudraksha: '5 मुखी' },
  { v: 'fire', hi: 'नुकीली ठुड्डी वाला (अग्नि तत्व)', r: 'ऊर्जावान, जोशीले, जल्दी निर्णय लेने वाले।', rudraksha: '3 मुखी' },
  { v: 'earth', hi: 'चौकोर चेहरा (पृथ्वी तत्व)', r: 'भरोसेमंद, स्थिर, मेहनती।', rudraksha: '8 मुखी' },
  { v: 'metal', hi: 'गोल चेहरा (धातु तत्व)', r: 'व्यवस्थित, अनुशासित, तर्कशील।', rudraksha: '6 मुखी' },
  { v: 'water', hi: 'चौड़ा माथा, पतली ठुड्डी (जल तत्व)', r: 'चिंतनशील, अनुकूल, गहरी समझ।', rudraksha: '2 मुखी' },
];
