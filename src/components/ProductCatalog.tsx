import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Eye, ShieldCheck, FileText, Sparkles, Tag, Bot, ArrowRight, Check, Camera, Upload, ExternalLink } from 'lucide-react';
import { getDiscountTier, getCouponCode } from '../data/mockData';
import { trackMetaEvent } from '../utils/metaTracker';
import { OfficialCertificate } from './OfficialCertificate';
import { KanhaAiChatIcon } from './AiIcons';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenAiChat: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenAiChat,
}) => {
  const [productList, setProductList] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [certificateProduct, setCertificateProduct] = useState<Product | null>(null);
  const [editingPhotoProduct, setEditingPhotoProduct] = useState<Product | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  const categories = [
    { id: 'all', label: 'All Sacred Collections' },
    { id: 'nepali', label: '1 to 21 Mukhi Nepali' },
    { id: 'gemstone', label: 'Certified Gemstones (Moonga, Pukhraj)' },
    { id: 'mala', label: 'Siddh & Japa Malas' },
    { id: 'combination', label: 'Sacred Combinations & Pendants' },
  ];

  const filteredProducts = activeCategory === 'all'
    ? productList
    : productList.filter(p => p.category === activeCategory);

  const handleCardClick = (product: Product) => {
    trackMetaEvent('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'INR'
    });
    onSelectProduct(product);
  };

  const handleDirectBuy = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    trackMetaEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: 'INR',
      action: 'direct_kanhaasa_website_buy'
    });
    onAddToCart(product);
  };

  const handleApplyCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhotoProduct || !customPhotoUrl.trim()) return;

    setProductList((prev) =>
      prev.map((p) =>
        p.id === editingPhotoProduct.id ? { ...p, image: customPhotoUrl.trim() } : p
      )
    );
    setEditingPhotoProduct(null);
    setCustomPhotoUrl('');
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPhotoProduct) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg = event.target.result as string;
          setProductList((prev) =>
            prev.map((p) =>
              p.id === editingPhotoProduct.id ? { ...p, image: newImg } : p
            )
          );
          setEditingPhotoProduct(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="catalog" className="py-16 sm:py-20 bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Web Store · www.kanhaasa.com</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Authentic Nepali Rudrakshas & Certified Gemstones
            </h2>
            <p className="text-sm text-stone-400 max-w-xl font-sans">
              Order directly through our verified website <strong className="text-white">www.kanhaasa.com</strong>. Every bead is certified with Kanha Asa ISO 9001:2015 reports with free pan-India delivery.
            </p>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-lg overflow-x-auto scrollbar-none shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Tier Discount Guide Banner */}
        <div className="mb-8 p-3.5 bg-stone-900/90 border border-amber-900/40 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2 bg-stone-950 rounded-lg border border-stone-800">
            <span className="w-7 h-7 rounded-full bg-amber-950 text-amber-300 font-bold flex items-center justify-center font-mono">10%</span>
            <div>
              <p className="font-bold text-white">Orders Under ₹10,000</p>
              <p className="text-[11px] text-stone-400">Coupon: <strong className="text-amber-400 font-mono">KANHA10</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 bg-stone-950 rounded-lg border border-amber-600/40 shadow-sm">
            <span className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-300 font-bold flex items-center justify-center font-mono">15%</span>
            <div>
              <p className="font-bold text-white">Orders Above ₹10,000</p>
              <p className="text-[11px] text-stone-400">Coupon: <strong className="text-emerald-400 font-mono">KANHA15</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 bg-stone-950 rounded-lg border border-stone-800">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-mono">25%</span>
            <div>
              <p className="font-bold text-white">Orders of ₹1 Lakh & Above</p>
              <p className="text-[11px] text-stone-400">Coupon: <strong className="text-amber-300 font-mono">KANHA25</strong></p>
            </div>
          </div>
        </div>

        {/* 3-Column Desktop Grid / 2-Column Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const tier = getDiscountTier(product.price);
            const coupon = getCouponCode(product.price);
            const discountPct = tier === '25%' ? 25 : tier === '15%' ? 15 : 10;
            const discountedPrice = Math.round(product.price * (1 - discountPct / 100));
            const savings = product.price - discountedPrice;

            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                className="group bg-stone-900/90 border border-stone-800/80 rounded-xl overflow-hidden flex flex-col hover:border-amber-900/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60" />

                  {/* Owner Custom Photo Upload Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPhotoProduct(product);
                    }}
                    title="Upload or change with your original product photo"
                    className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-stone-200 bg-stone-900/90 hover:bg-amber-500 hover:text-stone-950 border border-stone-700 backdrop-blur-sm px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Change Photo</span>
                  </button>

                  {/* ISO Certificate Trigger Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCertificateProduct(product);
                    }}
                    className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-stone-950/90 border border-amber-900/60 backdrop-blur-sm px-2.5 py-1 rounded hover:bg-stone-900 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kanha Asa Certificate</span>
                  </button>

                  {/* Tier Badge on Image */}
                  <div className="absolute top-3 right-3 text-[10px] font-extrabold text-stone-950 bg-amber-400 px-2 py-0.5 rounded shadow">
                    {tier} OFF · {coupon}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{product.rulingDeity}</span>
                      <span className="text-amber-400/90 font-medium">{product.rulingPlanet}</span>
                    </div>

                    <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-serif-luxury text-sm">
                      {product.hindiName}
                    </p>

                    <p className="text-xs text-stone-400 line-clamp-2 pt-1 font-sans">
                      {product.primaryBenefit}
                    </p>
                  </div>

                  {/* 3-Tier Discount Pricing Display (As Requested) */}
                  <div className="pt-3 border-t border-stone-800/80 space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-bold text-white tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="ml-2 text-xs text-stone-500 line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Free Pan-India Delivery
                        </span>
                      </div>

                      {/* Explicit Discount Tier Callout Below Every Product */}
                      <div className="p-2 bg-stone-950 border border-amber-900/40 rounded flex items-center justify-between text-[11px]">
                        <span className="text-stone-300">
                          Use <strong className="text-amber-400 font-mono">{coupon}</strong> ({tier} OFF):
                        </span>
                        <span className="font-bold text-emerald-400 tabular-nums">
                          Pay ₹{discountedPrice.toLocaleString('en-IN')} (Save ₹{savings.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>

                    {/* Direct Buy Online Button on www.kanhaasa.com */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleDirectBuy(product, e)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors whitespace-nowrap shadow-md cursor-pointer"
                        title="Buy Directly on www.kanhaasa.com"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy on Kanhaasa.com</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAiChat();
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <KanhaAiChatIcon size={14} />
                        <span>Ask AI Acharya</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Viewer Modal */}
      {certificateProduct && (
        <OfficialCertificate
          product={certificateProduct}
          isModal={true}
          onClose={() => setCertificateProduct(null)}
        />
      )}

      {/* Change Photo Modal for Owner ("ओरिजिनल फोटो मैं लगा सकूंगी") */}
      {editingPhotoProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-stone-900 border border-amber-900/60 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-bold text-white text-sm">
                Change Photo: {editingPhotoProduct.name}
              </h4>
              <button
                onClick={() => setEditingPhotoProduct(null)}
                className="text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Upload your original photograph or paste an image URL to replace the product picture:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">Upload File from Device:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileUpload}
                  className="w-full text-xs text-stone-300 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-stone-950 file:font-semibold cursor-pointer"
                />
              </div>

              <div className="relative flex items-center justify-center">
                <span className="bg-stone-900 px-2 text-[10px] text-stone-500 uppercase">Or via URL</span>
              </div>

              <form onSubmit={handleApplyCustomPhoto} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/rudraksha.jpg"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded cursor-pointer"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

