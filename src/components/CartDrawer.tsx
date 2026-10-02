import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, CheckCircle2, Tag, Percent, ArrowRight, Lock, Truck, Banknote, CreditCard, AlertCircle, Zap, MapPin, Loader2 } from 'lucide-react';
import { trackMetaEvent } from '../utils/metaTracker';
import { openRazorpayCheckout } from '../utils/razorpay';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  merchantPhone: string;
  appliedCoupon?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  merchantPhone,
  appliedCoupon,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [paymentId, setPaymentId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState('');

  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('लोकेशन सुविधा इस ब्राउज़र में उपलब्ध नहीं है। कृपया हाथ से पता लिखें।');
      return;
    }
    setIsLocating(true);
    setLocationSuccessMsg('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          const data = await res.json();
          if (data && data.address) {
            const a = data.address;
            const parts = [
              a.house_number,
              a.building,
              a.road || a.suburb || a.neighbourhood,
              a.city || a.town || a.village || a.county,
              a.state
            ].filter(Boolean);
            const formatted = parts.join(', ');
            if (formatted) setAddress(formatted);
            if (a.postcode) setPincode(a.postcode);
            setLocationSuccessMsg('✓ Google / GPS से सटीक पता प्राप्त हो गया!');
            setTimeout(() => setLocationSuccessMsg(''), 4000);
          }
        } catch (e) {
          console.warn('Geolocation reverse error:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission or error:', err);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // 3-Tier Discount Logic as instructed:
  // < 10,000 -> 10% (KANHA10)
  // 10,000 - 100,000 -> 15% (KANHA15)
  // >= 100,000 -> 25% (KANHA25)
  let discountPercent = 10;
  let activeCoupon = 'KANHA10';

  if (subtotal >= 100000) {
    discountPercent = 25;
    activeCoupon = 'KANHA25';
  } else if (subtotal >= 10000) {
    discountPercent = 15;
    activeCoupon = 'KANHA15';
  }

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const codFee = paymentMethod === 'cod' ? 150 : 0;
  const shippingFee = 0; // Always Free Shipping pan-India
  const finalTotal = subtotal - discountAmount + codFee;

  if (!isOpen) return null;

  const handleConfirmOnlineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) return;

    if (paymentMethod === 'cod') {
      // Cash on Delivery - Direct placement
      trackMetaEvent('Purchase', {
        value: finalTotal,
        currency: 'INR',
        content_name: 'Kanha Asa Certified Rudraksha Order (COD)',
        content_ids: items.map(i => i.product.id),
        num_items: items.length,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_method: 'cod',
        discount_applied: discountAmount,
        coupon_code: activeCoupon,
        cod_fee: codFee,
        shipping: 0
      });
      setOrderConfirmed(true);
      return;
    }

    // Prepaid Order - Launch Live Razorpay Gateway
    setIsProcessing(true);
    openRazorpayCheckout({
      amount: finalTotal,
      name: 'Kanha Asa - Store Checkout',
      description: `Order for ${items.length} items (${activeCoupon} Applied)`,
      customerName: customerName,
      customerPhone: customerPhone,
      notes: {
        address: `${address}, ${pincode}`,
        coupon: activeCoupon,
        discount: String(discountAmount),
        store: 'kanhaasa.com'
      },
      onSuccess: (pId: string) => {
        setPaymentId(pId);
        setIsProcessing(false);

        trackMetaEvent('Purchase', {
          value: finalTotal,
          currency: 'INR',
          content_name: 'Kanha Asa Certified Rudraksha Order (Prepaid Razorpay)',
          content_ids: items.map(i => i.product.id),
          num_items: items.length,
          customer_name: customerName,
          customer_phone: customerPhone,
          payment_method: 'razorpay',
          payment_id: pId,
          discount_applied: discountAmount,
          coupon_code: activeCoupon,
          cod_fee: 0,
          shipping: 0
        });

        setOrderConfirmed(true);
      },
      onFailure: (err: any) => {
        setIsProcessing(false);
        console.warn('Payment failed or closed:', err);
      },
      onDismiss: () => {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold font-display text-white leading-tight">
                  Direct Online Checkout
                </h2>
                <span className="text-[10px] text-stone-400 font-mono">www.kanhaasa.com Secure Portal</span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 text-stone-400 hover:text-white rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Delivery & COD Selector Bar with Icon Buttons */}
          <div className="bg-stone-950 border-b border-stone-800 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between text-stone-300">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>शिपिंग एवं डिलीवरी विकल्प (Delivery Mode):</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-300">
                {paymentMethod === 'cod' ? 'सीओडी (+₹150)' : 'फ्री डिलीवरी (₹0)'}
              </span>
            </div>

            {/* Interactive COD / Online Icon Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  paymentMethod !== 'cod'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  paymentMethod !== 'cod' ? 'bg-emerald-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}>
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white leading-tight">ऑनलाइन पेमेंट</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">मुफ़्त शिपिंग (₹0)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'bg-amber-950/70 border-amber-500 text-white ring-1 ring-amber-500/50'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  paymentMethod === 'cod' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}>
                  <Banknote className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white leading-tight">कैश ऑन डिलीवरी (COD)</p>
                  <p className="text-[10px] text-amber-300 font-semibold">+₹150 कूरियर चार्ज</p>
                </div>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {orderConfirmed ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Order Confirmed on www.kanhaasa.com!
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
                  Pranam {customerName} ji! Your online order of ₹{finalTotal.toLocaleString('en-IN')} has been placed successfully. Official Kanha Asa ISO 9001:2015 report is included with dispatch.
                </p>
                <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-lg text-left text-xs space-y-1.5 text-stone-400">
                  <div>Delivery Address: <span className="text-stone-200">{address}, {pincode}</span></div>
                  <div>Phone: <span className="text-stone-200">{customerPhone}</span></div>
                  <div>Payment Option: <span className="text-amber-400 uppercase font-semibold">{paymentMethod === 'cod' ? 'Cash on Delivery (सीओडी)' : 'Online Prepaid'}</span></div>
                  <div>Voucher Applied: <span className="text-emerald-400 font-mono font-bold">{activeCoupon} ({discountPercent}% OFF)</span></div>
                  <div>Shipping: <span className="text-emerald-400 font-semibold">{paymentMethod === 'cod' ? 'COD Handling: ₹150' : 'FREE (₹0)'}</span></div>
                  {paymentMethod === 'cod' && <div>COD Charge: <span className="text-amber-300 font-bold">₹150 (लागू)</span></div>}
                </div>
                <button
                  onClick={() => {
                    onClearCart();
                    setIsCheckingOut(false);
                    setOrderConfirmed(false);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded bg-amber-500 text-stone-950 hover:bg-amber-400 transition-colors cursor-pointer font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-stone-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-600" />
                <p className="text-sm font-medium text-stone-300">Your cart is empty</p>
                <p className="text-xs max-w-xs mx-auto">
                  Select authentic 1 to 21 Mukhi Nepali beads or certified gemstones from our online store.
                </p>
              </div>
            ) : !isCheckingOut ? (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg flex gap-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded border border-stone-800 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-semibold text-white line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-amber-400/90 font-serif-luxury">
                            {product.hindiName}
                          </p>
                        </div>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 0)}
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold text-white tabular-nums">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded px-1.5 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium text-white px-1 tabular-nums">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 3-Tier Discount Slab Auto-Applied Banner */}
                <div className="p-3.5 bg-stone-950 border border-amber-900/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{discountPercent}% Discount Voucher Applied!</span>
                    </span>
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono font-bold text-xs rounded border border-amber-800">
                      {activeCoupon}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-400">
                    {subtotal >= 100000
                      ? '₹1 Lakh+ Milestone reached! 25% VIP Discount applied.'
                      : subtotal >= 10000
                      ? 'Above ₹10,000 tier! 15% Savings applied.'
                      : 'Under ₹10,000 tier! 10% Savings applied.'}
                  </p>
                </div>

                {/* COD vs Prepaid Shipping Info Notice */}
                {paymentMethod === 'cod' ? (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/80 rounded-lg text-xs space-y-1 text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Banknote className="w-4 h-4" />
                      <span>सीओडी (Cash on Delivery) चुना गया है:</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      सीओडी पार्सल के लिए +₹150 कूरियर हैंडलिंग चार्ज जुड़ा है। पार्सल मिलने पर डिलीवरी एजेंट को नकद भुगतान करें।
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-800/80 rounded-lg text-xs space-y-1 text-emerald-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                      <CreditCard className="w-4 h-4" />
                      <span>ऑनलाइन भुगतान (Prepaid):</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      ऑनलाइन पेमेंट पर पूरे भारत में 100% मुफ़्त डिलीवरी (₹0 शिपिंग शुल्क) दी जा रही है।
                    </p>
                  </div>
                )}

                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs space-y-1 text-stone-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Included with Every Order</span>
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Official Kanha Asa ISO 9001:2015 Identification Card · Ganga Jal Vedic Abhishek Consecration · Sacred Red Silk Thread.
                  </p>
                </div>
              </div>
            ) : (
              /* Inline Direct Website Checkout Form */
              <form onSubmit={handleConfirmOnlineOrder} className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-semibold text-stone-200 uppercase tracking-wide">
                    Shipping & Payment Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Edit Cart
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 91318 05622"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-stone-300">Delivery Address *</label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer disabled:opacity-50"
                      title="Google / GPS से लाइव लोकेशन द्वारा सटीक पता भरें"
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>सटीक पता प्राप्त हो रहा है...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>Google / GPS से सही पता भरें</span>
                        </>
                      )}
                    </button>
                  </div>
                  {locationSuccessMsg && (
                    <p className="text-[11px] text-emerald-400 font-semibold mb-1 animate-pulse">
                      {locationSuccessMsg}
                    </p>
                  )}
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Flat No., Road / Street, Colony, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 302001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded text-xs text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Prominent Payment / Shipping Method Selector with Icon Buttons */}
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
                    <span>Payment & Shipping Method (भुगतान विकल्प) *</span>
                    <span className="text-[10px] text-amber-400">सीओडी: +₹150</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod !== 'cod'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">ऑनलाइन (Prepaid)</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">फ्री शिपिंग (₹0)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500/50'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">कैश ऑन डिलीवरी (COD)</p>
                        <p className="text-[10px] text-amber-300 font-semibold">+₹150 चार्ज</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 bg-stone-950 border border-stone-800 rounded text-xs space-y-1.5 text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>{discountPercent}% Discount ({activeCoupon}):</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Pan-India Shipping:</span>
                    <span className="font-bold">FREE (₹0)</span>
                  </div>
                  {paymentMethod === 'cod' ? (
                    <div className="flex justify-between text-amber-300 font-medium">
                      <span>Cash on Delivery Handling:</span>
                      <span className="tabular-nums font-bold">+₹150</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-stone-500">
                      <span>COD Fee:</span>
                      <span>₹0 (Prepaid Online)</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-white text-sm">
                    <span>Grand Payable Amount:</span>
                    <span className="text-amber-400 tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg mt-2 flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cod' ? 'Confirm COD Order' : 'Confirm & Place Order'} (₹{finalTotal.toLocaleString('en-IN')})
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Footer Bar */}
          {!orderConfirmed && items.length > 0 && !isCheckingOut && (
            <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 space-y-3">
              <div className="space-y-1 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-stone-200 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({discountPercent}% {activeCoupon}):</span>
                  <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
                {paymentMethod === 'cod' ? (
                  <div className="flex justify-between text-amber-300 font-medium">
                    <span>COD Handling Fee:</span>
                    <span className="tabular-nums font-bold">+₹150</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-emerald-400">
                    <span>Shipping:</span>
                    <span className="font-semibold">FREE (₹0)</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-1 border-t border-stone-800 font-bold text-white">
                  <span>Total Payable:</span>
                  <span className="text-base text-amber-400 tabular-nums">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Direct Website Checkout Button */}
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 px-4 text-xs font-bold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Direct Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
