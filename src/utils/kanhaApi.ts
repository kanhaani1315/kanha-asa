import { openRazorpayCheckout } from './razorpay';

const API = 'https://ai.wdapro.com/webhook';
const TOKEN_KEY = 'ka_astro_token';

export interface Wallet {
  phone: string;
  name: string | null;
  balance: number;
  free_questions_left: number;
  free_call_available: boolean;
  chat_price: number;
  call_price_per_min: number;
}

export interface ApiResult {
  ok: boolean;
  reason?: string;
  wallet?: Wallet;
  [k: string]: any;
}

export const CREDIT_PACKS = [
  { price: 9, credits: 10, label: 'Mini', note: '1 सवाल' },
  { price: 15, credits: 20, label: 'Mini', note: '2 सवाल' },
  { price: 29, credits: 40, label: 'Lite', note: '4 सवाल' },
  { price: 33, credits: 50, label: 'Lite', note: '5 सवाल' },
  { price: 50, credits: 80, label: 'Basic', note: '8 सवाल' },
  { price: 70, credits: 120, label: 'Basic', note: '12 सवाल' },
  { price: 99, credits: 180, label: 'Popular', note: '18 सवाल', popular: true },
  { price: 200, credits: 400, label: 'Value', note: '40 सवाल' },
  { price: 500, credits: 1100, label: 'Family', note: '110 सवाल' },
];

export const REASON_TEXT: Record<string, string> = {
  invalid_phone: 'कृपया सही 10 अंकों का मोबाइल नंबर डालें।',
  too_many: 'बहुत बार कोशिश हो गई। कृपया 1 घंटे बाद फिर कोशिश करें।',
  whatsapp_failed: 'WhatsApp पर OTP नहीं जा पाया। कृपया थोड़ी देर बाद कोशिश करें या +91 9131805622 पर WhatsApp करें।',
  expired: 'OTP की समय-सीमा खत्म हो गई। नया OTP मंगाएँ।',
  wrong_code: 'OTP गलत है। दोबारा जाँचें।',
  login_required: 'कृपया पहले मोबाइल नंबर से लॉगिन करें।',
  need_credits: 'आपके क्रेडिट्स खत्म हो गए हैं। जारी रखने के लिए रिचार्ज करें।',
  ai_busy: 'AI अभी व्यस्त है, आपका क्रेडिट नहीं कटा। कृपया दोबारा पूछें।',
  closed_hours: 'AI कॉल सुबह 9 बजे से रात 9 बजे तक ही होती है। कृपया इस समय में अनुरोध करें।',
  call_in_progress: 'आपकी एक कॉल अभी चल रही है / कुछ मिनट पहले शुरू हुई है। कृपया 5 मिनट बाद कोशिश करें।',
  call_failed: 'कॉल शुरू नहीं हो पाई, आपका बैलेंस नहीं कटा। कृपया थोड़ी देर बाद कोशिश करें।',
  payment_not_verified: 'पेमेंट वेरीफाई नहीं हुआ। अगर पैसे कटे हैं तो +91 9131805622 पर WhatsApp करें।',
  payment_check_failed: 'पेमेंट जाँच में दिक्कत आई। अगर पैसे कटे हैं तो चिंता न करें, हमारी टीम जाँच कर क्रेडिट जोड़ देगी।',
  network: 'इंटरनेट/सर्वर से जुड़ने में दिक्कत। कृपया दोबारा कोशिश करें।',
};

export const reasonText = (r?: string) => REASON_TEXT[r || ''] || 'कुछ गड़बड़ हुई, कृपया दोबारा कोशिश करें।';

// ---- tiny shared store so chat + call modals show the same wallet ----
type Listener = (w: Wallet | null) => void;
let currentWallet: Wallet | null = null;
const listeners = new Set<Listener>();
export const getWallet = () => currentWallet;
export const setWallet = (w: Wallet | null) => {
  currentWallet = w;
  listeners.forEach((l) => l(w));
};
export const subscribeWallet = (l: Listener) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
const saveToken = (t: string | null) => {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

async function post(path: string, body: any): Promise<ApiResult> {
  try {
    const res = await fetch(`${API}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!data) return { ok: false, reason: 'network' };
    if (data.wallet) setWallet(data.wallet);
    if (data.reason === 'login_required') {
      saveToken(null);
      setWallet(null);
    }
    return data;
  } catch {
    return { ok: false, reason: 'network' };
  }
}

export const sendOtp = (phone: string) => post('ka-otp-send', { phone });

export async function verifyOtp(phone: string, code: string, name: string) {
  const r = await post('ka-otp-verify', { phone, code, name });
  if (r.ok && r.token) saveToken(r.token);
  return r;
}

export async function guestLogin(phone: string, name: string) {
  const r = await post('ka-guest-login', { phone, name });
  if (r.ok && r.token) saveToken(r.token);
  return r;
}

export async function refreshWallet() {
  const token = getToken();
  if (!token) {
    setWallet(null);
    return null;
  }
  const r = await post('ka-wallet', { token });
  return r.ok ? r.wallet ?? null : null;
}

export function logout() {
  saveToken(null);
  setWallet(null);
}

export const askAstrologer = (message: string, history: { role: 'user' | 'ai'; text: string }[]) =>
  post('ka-ai-chat', { token: getToken(), message, history });

export const requestAiCall = (topic: string) => post('ka-ai-call', { token: getToken(), topic });

export function buyCredits(price: number): Promise<ApiResult> {
  const w = getWallet();
  return new Promise((resolve) => {
    openRazorpayCheckout({
      amount: price,
      description: `Kanha AI Acharya Credits (₹${price})`,
      customerName: w?.name || undefined,
      customerPhone: w?.phone ? w.phone.replace(/\D/g, '').slice(-10) : undefined,
      notes: { purpose: 'astro_credits', phone: w?.phone || '' },
      onSuccess: async (paymentId: string) => {
        const r = await post('ka-buy-credits', { token: getToken(), razorpay_payment_id: paymentId });
        resolve(r);
      },
      onFailure: () => resolve({ ok: false, reason: 'payment_failed' }),
      onDismiss: () => resolve({ ok: false, reason: 'dismissed' }),
    });
  });
}
