export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: 'nepali' | 'mala' | 'gemstone' | 'combination';
  price: number;
  originalPrice: number;
  mukhiCount?: string;
  rulingDeity: string;
  rulingPlanet: string;
  primaryBenefit: string;
  mantra: string;
  description: string;
  image: string;
  certified: boolean;
  inStock: boolean;
  wearDay: string;
  origin: string;
  sipAvailable?: boolean;
  sipMonthly?: number;
  certificateNumber?: string;
  weightGms?: string;
  dimensionsMm?: string;
  xrayCompartments?: string;
  discountTier?: '10%' | '15%' | '25%';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city?: string;
  concern: string;
  birthDate?: string;
  rashi?: string;
  productInterest?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'followup';
  notes?: string;
  unlockedCoupon?: string;
}

export interface MetaEvent {
  id: string;
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Lead' | 'Contact' | 'Purchase';
  timestamp: string;
  payload: Record<string, any>;
  status: 'Dispatched' | 'Queued';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AutomationConfig {
  merchantPhone: string; // Normal calling & WhatsApp (9131805622)
  metaPixelId: string;
  webhookUrl: string;
  enableAutoWelcome: boolean;
  enableCartRecovery: boolean;
  welcomeTemplate: string;
  cartRecoveryTemplate: string;
  codCharge: number; // ₹150
  showCertificate: boolean; // Option to toggle certificate display
}

export interface SipPlan {
  id: string;
  title: string;
  frequency: 'monthly' | 'quarterly' | 'half_yearly';
  amount: number;
  originalAmount: number;
  durationMonths: number;
  description: string;
  benefits: string[];
  popular?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  loShuData?: {
    grid: number[][];
    missingNumbers: number[];
    presentNumbers: number[];
    mulank: number;
    bhagyank: number;
    recommendedRemedies: string[];
  };
}

export interface MobileHarmfulPair {
  pair: string;
  name: string;
  effects: string;
  severity: 'high' | 'medium';
  remedyRudraksha: string;
  remedyGemstone: string;
  price: string;
}

export interface MobileLuckyPair {
  pair: string;
  name: string;
  effects: string;
}

export interface MobileAnalysisResult {
  phoneNumber: string;
  totalSum: number;
  rootNumber: number;
  rulingPlanet: string;
  harmfulPairsFound: MobileHarmfulPair[];
  luckyPairsFound: MobileLuckyPair[];
  overallRating: 'अत्यंत शुभ (Highly Auspicious)' | 'मध्यम (Average)' | 'दोषपूर्ण (Needs Remedy)' | 'अशुभ (Critical Warning)';
  score: number;
  advice: string;
  recommendedRemedies: {
    rudraksha: string;
    gemstone: string;
    mantra: string;
    price: string;
  };
}

export interface NameNumerologyResult {
  name: string;
  compoundNumber: number;
  singleDigit: number;
  rulingPlanet: string;
  letterBreakdown: { letter: string; value: number }[];
  numbersAddedToGrid: number[];
  missingNumbersFulfilled: number[];
  recommendation: string;
}

export interface LoShuRemedy {
  number: number;
  defect: string;
  rudraksha: string;
  stone: string;
  price: string;
  code: string;
}

export interface LoShuGridResult {
  mulank: number;
  bhagyank: number;
  birthNumbers: number[];
  missingNumbers: number[];
  remedies: LoShuRemedy[];
}

