/**
 * Razorpay Payment Gateway Integration for Kanha Asa
 * Live Key ID: rzp_live_TixYX0D9CDAz18
 */

export const RAZORPAY_KEY_ID = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TixYX0D9CDAz18';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayPaymentConfig {
  amount: number; // In Rupees (e.g. 1499, 49, etc.)
  name?: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: Record<string, string>;
  onSuccess: (paymentId: string) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Dynamically load the Razorpay checkout script if not already present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('razorpay-checkout-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay Standard Checkout modal
 */
export async function openRazorpayCheckout(config: RazorpayPaymentConfig): Promise<void> {
  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    console.warn('Razorpay script could not be loaded directly. Running fallback handler.');
    // If blocked by adblock or network, invoke failure or mock success in test environment
    if (config.onFailure) {
      config.onFailure({ message: 'Razorpay script failed to load. Please check network or use UPI QR.' });
    }
    return;
  }

  const amountInPaise = Math.round(config.amount * 100);

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    name: 'Kanha Asa - Astro & Rudraksha',
    description: config.description || 'Vedic Consecrated Rudraksha Order',
    image: 'https://kanhaasa.com/favicon.ico',
    handler: function (response: any) {
      const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
      config.onSuccess(paymentId);
    },
    prefill: {
      name: config.customerName || 'Kanha Asa Devotee',
      email: config.customerEmail || 'support@kanhaasa.com',
      contact: config.customerPhone ? config.customerPhone.replace(/\D/g, '') : '9131805622'
    },
    notes: {
      merchant: 'Kanha Asa Astro & Rudraksha',
      address: 'Shop No. BF3/3, Ground Floor, B-Block, Shilpi Plaza, Above Axis Bank, Shilpi Plaza Road, Rewa, Madhya Pradesh - 486001',
      ...(config.notes || {})
    },
    theme: {
      color: '#d97706' // Sacred Amber Gold
    },
    modal: {
      ondismiss: function () {
        if (config.onDismiss) {
          config.onDismiss();
        }
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      if (config.onFailure) {
        config.onFailure(response.error);
      }
    });
    rzp.open();
  } catch (err) {
    console.error('Failed to open Razorpay instance:', err);
    if (config.onFailure) {
      config.onFailure(err);
    }
  }
}
