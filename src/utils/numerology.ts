import { MobileAnalysisResult, MobileHarmfulPair, MobileLuckyPair, NameNumerologyResult, LoShuGridResult, LoShuRemedy } from '../types';

// Chaldean Numerology Value Map
export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const PLANET_MAP: Record<number, string> = {
  1: 'सूर्य (Sun / Lord Shiva)',
  2: 'चन्द्र (Moon / Parvati Ji)',
  3: 'गुरु (Jupiter / Brahma & Brihaspati)',
  4: 'राहु (Rahu / Saraswati & Ganesh)',
  5: 'बुध (Mercury / Vishnu Dev)',
  6: 'शुक्र (Venus / Mahalakshmi & Kartikeya)',
  7: 'केतु (Ketu / Matsya & Ganesh)',
  8: 'शनि (Saturn / Hanuman & Shani Dev)',
  9: 'मंगल (Mars / Hanuman Ji)'
};

/**
 * Reduce a number to a single digit (1-9)
 */
export function reduceToSingleDigit(num: number): number {
  let sum = num;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

/**
 * Calculate Chaldean Name Numerology & identify which missing Lo Shu numbers it fills
 */
export function calculateNameNumerology(name: string, missingLoShuNumbers: number[] = []): NameNumerologyResult {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const breakdown: { letter: string; value: number }[] = [];
  let compoundSum = 0;
  const nameNumbersSet = new Set<number>();

  for (const char of cleanName) {
    const val = CHALDEAN_MAP[char] || 0;
    if (val > 0) {
      breakdown.push({ letter: char, value: val });
      compoundSum += val;
      nameNumbersSet.add(val);
    }
  }

  const singleDigit = reduceToSingleDigit(compoundSum);
  if (singleDigit > 0) {
    nameNumbersSet.add(singleDigit);
  }

  const numbersAddedToGrid = Array.from(nameNumbersSet).sort((a, b) => a - b);
  const missingNumbersFulfilled = missingLoShuNumbers.filter((n) => nameNumbersSet.has(n));

  let recommendation = '';
  if (missingNumbersFulfilled.length > 0) {
    recommendation = `शुभ समाचार! आपके नाम से ग्रिड में मिसिंग नंबर ${missingNumbersFulfilled.join(', ')} की ऊर्जा सक्रिय हो रही है।`;
  } else {
    recommendation = `आपके नाम का कुल मूलांक ${singleDigit} (${PLANET_MAP[singleDigit] || 'Planet'}) है। मिसिंग नंबरों की भरपाई के लिए अनुशंसित रुद्राक्ष या रत्न धारण करें।`;
  }

  return {
    name,
    compoundNumber: compoundSum,
    singleDigit,
    rulingPlanet: PLANET_MAP[singleDigit] || 'अज्ञात',
    letterBreakdown: breakdown,
    numbersAddedToGrid,
    missingNumbersFulfilled,
    recommendation
  };
}

/**
 * Calculate 3x3 Lo Shu Grid, Mulank, Bhagyank and identify missing numbers with remedies
 */
export function calculateLoShuGrid(dateStr: string): LoShuGridResult | null {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  // Mulank (Driver Number = sum of day)
  let dSum = Math.floor(day / 10) + (day % 10);
  while (dSum > 9) {
    dSum = Math.floor(dSum / 10) + (dSum % 10);
  }
  const mulank = dSum;

  // Bhagyank (Conductor Number = sum of all digits)
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  let totalSum = allDigits.reduce((a, b) => a + b, 0);
  while (totalSum > 9) {
    totalSum = Math.floor(totalSum / 10) + (totalSum % 10);
  }
  const bhagyank = totalSum;

  // Digits present in Date of Birth (including Mulank & Bhagyank)
  const gridDigits = [...allDigits, mulank, bhagyank].filter(n => n >= 1 && n <= 9);
  const birthNumbers = Array.from(new Set(gridDigits)).sort((a, b) => a - b);
  const missingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !birthNumbers.includes(n));

  // Lo Shu remedies mapping
  const remedyMap: Record<number, { defect: string; rudraksha: string; stone: string; price: string; code: string }> = {
    4: { defect: 'धन का न टिकना, राहु दोष व मानसिक भटकाव', rudraksha: '7 मुखी महालक्ष्मी (₹4,500) या 8 मुखी गणेश (₹6,800)', stone: 'गोमेद या पन्ना', price: '₹4,500', code: 'KANHA10 (10% OFF)' },
    9: { defect: 'यश, मान-सम्मान व ऊर्जा की कमी', rudraksha: '1 मुखी गोल दाना (₹35,000) या 12 मुखी सूर्य (₹14,500)', stone: 'प्राकृतिक माणिक या लाल मूंगा', price: '₹14,500', code: 'KANHA15 (15% OFF)' },
    2: { defect: 'मानसिक अशांति, वैवाहिक विलंब व भावुकता', rudraksha: '2 मुखी अर्धनारीश्वर (₹3,200) या गौरी शंकर (₹18,500)', stone: 'साउथ सी सच्चा मोती (Pearl)', price: '₹3,200', code: 'KANHA10 (10% OFF)' },
    3: { defect: 'ज्ञान, परिवार सुख व गुरु कृपा की कमी', rudraksha: '4 मुखी ब्रह्मा (₹1,800) या 5 मुखी 108 जप माला (₹3,400)', stone: 'सिलोनी पीला पुखराज (Pukhraj)', price: '₹3,400', code: 'KANHA10 (10% OFF)' },
    5: { defect: 'जीवन का केंद्रीय संतुलन, वाणी व व्यापार में अस्थिरता', rudraksha: '5 मुखी (₹3,400) या 10 मुखी नारायण (₹9,800)', stone: 'जाम्बियन पन्ना (Emerald)', price: '₹3,400', code: 'KANHA10 (10% OFF)' },
    7: { defect: 'संतान चिंता, निराशा व अंतर्ज्ञान की कमी', rudraksha: '8 मुखी गणेश (₹6,800) या 11 मुखी हनुमान (₹11,500)', stone: 'लहसुनिया (Cat\'s Eye)', price: '₹6,800', code: 'KANHA10 (10% OFF)' },
    8: { defect: 'कड़ा संघर्ष, न्याय में देरी व शनि साढ़ेसाती कष्ट', rudraksha: '14 मुखी देवमणि (₹48,000) या 7 मुखी (₹4,500)', stone: 'रॉयल ब्लू नीलम (Blue Sapphire)', price: '₹48,000', code: 'KANHA15 (15% OFF)' },
    1: { defect: 'करियर में पदोन्नति न होना, आत्मविश्वास की कमी', rudraksha: '1 मुखी साउथ दाना रजत पेंडेंट (₹3,800) या 12 मुखी (₹14,500)', stone: 'सूर्य रत्न / माणिक', price: '₹3,800', code: 'KANHA10 (10% OFF)' },
    6: { defect: 'भौतिक सुख, वाहन, विलासिता व आकर्षण का अभाव', rudraksha: '6 मुखी कार्तिकेय (₹2,200) या 13 मुखी कामदेव (₹19,500)', stone: 'डायमंड / व्हाइट जरकन', price: '₹2,200', code: 'KANHA10 (10% OFF)' }
  };

  const remedies: LoShuRemedy[] = missingNumbers.map(num => ({
    number: num,
    ...remedyMap[num]
  }));

  return {
    mulank,
    bhagyank,
    birthNumbers,
    missingNumbers,
    remedies
  };
}

/**
 * Analyze 10-digit Mobile Number for Harmful & Auspicious Combinations
 */
export function analyzeMobileNumber(mobileStr: string, mulank?: number): MobileAnalysisResult {
  const digits = mobileStr.replace(/\D/g, '');
  const totalSum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  const rootNumber = reduceToSingleDigit(totalSum);

  const harmfulPairsFound: MobileHarmfulPair[] = [];
  const luckyPairsFound: MobileLuckyPair[] = [];

  // Database of Harmful Combinations (दुष्ट / हानिकारक जोड़े)
  const HARMFUL_PATTERNS: { pattern: RegExp; pair: string; name: string; effects: string; severity: 'high' | 'medium'; remedyRudraksha: string; remedyGemstone: string; price: string }[] = [
    {
      pattern: /24|42/,
      pair: '2-4 / 4-2',
      name: 'चन्द्र-राहु ग्रहण दोष (Grahan Dosha)',
      effects: 'मानसिक तनाव, डिप्रेशन, अचानक भारी धन हानि, निर्णय लेने में भ्रम और अनिद्रा।',
      severity: 'high',
      remedyRudraksha: '8 मुखी गणेश (₹6,800) या 2 मुखी अर्धनारीश्वर (₹3,200)',
      remedyGemstone: 'प्राकृतिक मोती (South Sea Pearl) या गोमेद',
      price: '₹3,200'
    },
    {
      pattern: /18|81/,
      pair: '1-8 / 8-1',
      name: 'सूर्य-शनि संघर्ष दोष (Surya-Shani Conflict)',
      effects: 'पिता से अनबन, सरकारी व कानूनी अड़चनें, पदोन्नति में रुकावट, अहंकार का टकराव।',
      severity: 'high',
      remedyRudraksha: '1 मुखी नेपाली (₹35,000) या 14 मुखी देवमणि (₹48,000)',
      remedyGemstone: 'रॉयल ब्लू नीलम या प्राकृतिक माणिक (Ruby)',
      price: '₹3,800'
    },
    {
      pattern: /48|84/,
      pair: '4-8 / 8-4',
      name: 'राहु-शनि महा-संघर्ष (Extreme Obstacles)',
      effects: 'कठिन परिश्रम के बाद भी फल न मिलना, चोट या दुर्घटना का भय, कर्ज का बोझ।',
      severity: 'high',
      remedyRudraksha: '7 मुखी महालक्ष्मी (₹4,500) एवं 10 मुखी विष्णु (₹9,800)',
      remedyGemstone: 'हेशोनाइट गोमेद या जाम्बियन पन्ना',
      price: '₹4,500'
    },
    {
      pattern: /36|63/,
      pair: '3-6 / 6-3',
      name: 'देवगुरु-असुरगुरु टकराव (Ego & Relationship Clash)',
      effects: 'दाम्पत्य जीवन में कलह, अनियंत्रित फिजूलखर्ची, ज्ञान का सही उपयोग न होना।',
      severity: 'medium',
      remedyRudraksha: 'गौरी शंकर रुद्राक्ष (₹18,500) या 6 मुखी कार्तिकेय (₹2,200)',
      remedyGemstone: 'सिलोनी पीला पुखराज (Pukhraj)',
      price: '₹2,200'
    },
    {
      pattern: /28|82/,
      pair: '2-8 / 8-2',
      name: 'विष योग (Vish Yog / Sluggish Career)',
      effects: 'प्रत्येक कार्य में अत्यधिक विलंब, निराशावादी सोच, वैवाहिक जीवन में असंतोष।',
      severity: 'high',
      remedyRudraksha: '14 मुखी देवमणि (₹48,000) या सर्व सिद्ध माला (₹68,500)',
      remedyGemstone: 'नीलम एवं मोती का संतुलित कवच',
      price: '₹4,500'
    },
    {
      pattern: /00|0$/,
      pair: 'अंतिम या दोहरा शून्य (0)',
      name: 'ऊर्जा क्षरण (Energy & Wealth Leakage)',
      effects: 'कमाई का अचानक व्यर्थ कार्यों में बह जाना, स्थिरता की भारी कमी।',
      severity: 'medium',
      remedyRudraksha: '10 मुखी नारायण रुद्राक्ष (₹9,800)',
      remedyGemstone: 'इटालियन लाल मूंगा कैप्सूल (₹8,900)',
      price: '₹8,900'
    }
  ];

  // Database of Lucky Combinations (शुभ व भाग्यशाली जोड़े)
  const LUCKY_PATTERNS: { pattern: RegExp; pair: string; name: string; effects: string }[] = [
    {
      pattern: /15|51/,
      pair: '1-5 / 5-1',
      name: 'बुधादित्य राजयोग (Budhaditya Yog)',
      effects: 'व्यापार में प्रचंड लाभ, तीक्ष्ण बुद्धि, प्रभावशाली वाणी और नेतृत्व।'
    },
    {
      pattern: /56|65/,
      pair: '5-6 / 6-5',
      name: 'महालक्ष्मी धन योग (Mahalakshmi Yog)',
      effects: 'आकर्षक व्यक्तित्व, धन-सम्पदा, विलासिता और सुखी जीवन।'
    },
    {
      pattern: /37|73/,
      pair: '3-7 / 7-3',
      name: 'गुरु-केतु ज्ञान योग (Wisdom & Intuition)',
      effects: 'सटीक अंतर्ज्ञान, आध्यात्मिक सिद्धि, उच्च शिक्षा व शोध में सफलता।'
    },
    {
      pattern: /13|31/,
      pair: '1-3 / 3-1',
      name: 'सूर्य-बृहस्पति राजयोग (Royal Authority)',
      effects: 'उच्च प्रशासनिक पद, समाज में मान-सम्मान व सरकारी सहयोग।'
    },
    {
      pattern: /95|59/,
      pair: '9-5 / 5-9',
      name: 'मंगल-बुध पराक्रम योग (Dynamic Energy)',
      effects: 'साहस, रियल एस्टेट में सफलता, संकट से उबरने की गजब क्षमता।'
    }
  ];

  // Detect Harmful Pairs
  for (const hp of HARMFUL_PATTERNS) {
    if (hp.pattern.test(digits)) {
      harmfulPairsFound.push({
        pair: hp.pair,
        name: hp.name,
        effects: hp.effects,
        severity: hp.severity,
        remedyRudraksha: hp.remedyRudraksha,
        remedyGemstone: hp.remedyGemstone,
        price: hp.price
      });
    }
  }

  // Detect Lucky Pairs
  for (const lp of LUCKY_PATTERNS) {
    if (lp.pattern.test(digits)) {
      luckyPairsFound.push({
        pair: lp.pair,
        name: lp.name,
        effects: lp.effects
      });
    }
  }

  // Calculate Rating & Score
  let score = 75;
  if (luckyPairsFound.length > 0) score += luckyPairsFound.length * 10;
  if (harmfulPairsFound.length > 0) score -= harmfulPairsFound.length * 15;
  score = Math.max(20, Math.min(98, score));

  let overallRating: MobileAnalysisResult['overallRating'] = 'मध्यम (Average)';
  let advice = '';

  if (score >= 80 && harmfulPairsFound.length === 0) {
    overallRating = 'अत्यंत शुभ (Highly Auspicious)';
    advice = 'यह मोबाइल नंबर आपके व्यापार और करियर के लिए अत्यंत अनुकूल कंपन पैदा कर रहा है।';
  } else if (harmfulPairsFound.some((h) => h.severity === 'high')) {
    overallRating = 'अशुभ (Critical Warning)';
    advice = 'इस नंबर में घातक ग्रह टकराव पाए गए हैं। तुरंत अनुशंसित रुद्राक्ष या रत्न कवच धारण करके इस दोष को शांत करें।';
  } else if (harmfulPairsFound.length > 0) {
    overallRating = 'दोषपूर्ण (Needs Remedy)';
    advice = 'नंबर में कुछ हानिकारक जोड़े हैं जो धन और स्वास्थ्य में रुकावट ला सकते हैं। वैदिक उपाय आवश्यक है।';
  } else {
    overallRating = 'मध्यम (Average)';
    advice = 'नंबर सामान्य है। शुभ ऊर्जा को और अधिक प्रबल करने के लिए वैदिक उपाय कर सकते हैं।';
  }

  // Primary remedy
  const primaryRemedy = harmfulPairsFound[0] || {
    remedyRudraksha: '7 मुखी नेपाली महालक्ष्मी रुद्राक्ष (₹4,500)',
    remedyGemstone: 'प्राकृतिक इटालियन लाल मूंगा (₹8,900)',
    price: '₹4,500'
  };

  return {
    phoneNumber: mobileStr,
    totalSum,
    rootNumber,
    rulingPlanet: PLANET_MAP[rootNumber] || 'अज्ञात',
    harmfulPairsFound,
    luckyPairsFound,
    overallRating,
    score,
    advice,
    recommendedRemedies: {
      rudraksha: primaryRemedy.remedyRudraksha,
      gemstone: primaryRemedy.remedyGemstone,
      mantra: `ॐ ह्रीं नमः (108 Chants daily for Mulank ${rootNumber})`,
      price: primaryRemedy.price
    }
  };
}
