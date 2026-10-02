import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, ShieldCheck, Calendar, FileText, Bot, Tag, ArrowRight } from 'lucide-react';
import { getDiscountTier, getCouponCode } from '../data/mockData';
import { trackMetaEvent } from '../utils/metaTracker';
import { OfficialCertificate } from './OfficialCertificate';
import { KanhaAiChatIcon } from './AiIcons';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onOpenAiChat: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenAiChat,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  if (!product) return null;

  const tier = getDiscountTier(product.price);
  const coupon = getCouponCode(product.price);
  const discountPct = tier === '25%' ? 25 : tier === '15%' ? 15 : 10;
  const discountedPrice = Math.round(product.price * (1 - discountPct / 100));
  const savings = product.price - discountedPrice;

  const handleDirectBuy = () => {
    trackMetaEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: 'INR',
      action: 'modal_direct_website_buy'
    });
    onAddToCart(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-white bg-stone-950/70 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Media Gallery */}
            <div className="relative bg-stone-950 p-6 flex flex-col justify-between">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-800">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Official Certificate Verification Card */}
              <div className="mt-4 p-4 bg-stone-900/90 rounded-lg border border-stone-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-amber-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Kanha Asa ISO 9001:2015 Report</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-400">
                    {product.certificateNumber || 'Verified'}
                  </span>
                </div>

                <p className="text-stone-400 text-[11px]">
                  Backed by the official Kanha Asa ISO 9001:2015 Rudraksha Identification Report with X-Ray proof, IAF & EGAC accreditation.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-600/40 rounded flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Official Lab Certificate Card</span>
                </button>
              </div>
            </div>

            {/* Right: Purchase & Vedic Info */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Deity & Planet */}
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span>Ruling Deity: <strong className="text-stone-200">{product.rulingDeity}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Planet: <strong className="text-amber-400">{product.rulingPlanet}</strong></span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {product.name}
                  </h2>
                  <p className="text-sm text-amber-300 font-serif-luxury mt-0.5">
                    {product.hindiName}
                  </p>
                </div>

                {/* Price & 3-Tier Discount Slab */}
                <div className="space-y-2 py-2 border-y border-stone-800">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-stone-500 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Free Shipping (₹0)
                    </span>
                  </div>

                  {/* Explicit Discount Tier Callout */}
                  <div className="p-3 bg-stone-950 border border-amber-900/50 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="text-amber-400 font-bold font-mono text-sm">{coupon}</span>
                      <span className="text-stone-300 ml-2">({tier} OFF Applied)</span>
                    </div>
                    <span className="font-bold text-emerald-400 tabular-nums">
                      Pay ₹{discountedPrice.toLocaleString('en-IN')} (Save ₹{savings.toLocaleString('en-IN')})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>Prepaid: मुफ़्त डिलीवरी (₹0) | सीओडी: ₹150 हैंडलिंग चार्ज</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        document.getElementById('sip-plans')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      आसान किस्तों में लें ➔
                    </button>
                  </div>
                </div>

                {/* Vedic Details */}
                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-md space-y-1">
                    <span className="text-[11px] text-amber-400 font-semibold uppercase">Sacred Beej Mantra</span>
                    <p className="text-sm font-serif-luxury text-amber-200 font-medium">"{product.mantra}" (108 chants)</p>
                  </div>

                  <div className="flex items-center gap-2 text-stone-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Auspicious Wearing Day: <strong>{product.wearDay}</strong></span>
                  </div>

                  <p className="text-stone-400 text-xs leading-relaxed pt-1 font-sans">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Direct Buy Online on www.kanhaasa.com */}
              <div className="space-y-2.5 pt-4 border-t border-stone-800">
                <button
                  onClick={handleDirectBuy}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-md bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Online on www.kanhaasa.com (Apply {tier} Voucher)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAiChat();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors cursor-pointer"
                  >
                    <KanhaAiChatIcon size={15} />
                    <span>Ask AI About This</span>
                  </button>

                  <button
                    onClick={() => setShowCertificate(true)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lab Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCertificate && (
        <OfficialCertificate
          product={product}
          isModal={true}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
};
