import React, { useState, useEffect } from 'react';
import { Product, Lead, CartItem, AutomationConfig, MetaEvent, SipPlan } from './types';
import { PRODUCTS, INITIAL_LEADS, DEFAULT_AUTOMATION_CONFIG, SIP_PLANS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { TopDreamInstallmentTicker } from './components/TopDreamInstallmentTicker';
import { ScrollingTreeTicker } from './components/ScrollingTreeTicker';
import { Hero } from './components/Hero';
import { MukhiFinder } from './components/MukhiFinder';
import { ProductCatalog } from './components/ProductCatalog';
import { SipPlans } from './components/SipPlans';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AstroConsultation } from './components/AstroConsultation';
import { AuthenticityGuarantee } from './components/AuthenticityGuarantee';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { KanhaSocialHub } from './components/KanhaSocialHub';
import { FeedbackNewsTicker } from './components/FeedbackNewsTicker';
import { CartDrawer } from './components/CartDrawer';
import { MetaAdsCenter } from './components/MetaAdsCenter';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuickLeadModal } from './components/QuickLeadModal';
import { MetaEventToast } from './components/MetaEventToast';
import { Footer } from './components/Footer';
import { AiAstrologerChat } from './components/AiAstrologerChat';
import { AiCallingModal } from './components/AiCallingModal';
import { trackMetaEvent, subscribeToMetaEvents, getMetaEventHistory } from './utils/metaTracker';

export default function App() {
  const [activeView, setActiveView] = useState<'store' | 'meta-hub'>('store');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickLeadOpen, setIsQuickLeadOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiCallingOpen, setIsAiCallingOpen] = useState(false);
  const [unlockedCoupon, setUnlockedCoupon] = useState<string>('KANHA10');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [metaEvents, setMetaEvents] = useState<MetaEvent[]>(getMetaEventHistory());
  const [automationConfig, setAutomationConfig] = useState<AutomationConfig>(DEFAULT_AUTOMATION_CONFIG);

  // Initialize PageView event and subscribe to live Meta events
  useEffect(() => {
    trackMetaEvent('PageView', {
      page_title: 'Kanha Asa - 1 to 21 Mukhi Nepali Rudrakshas & Certified Gemstones',
      brand: 'Kanha Asa',
      domain: 'kanhaasa.com',
      iso_certified: 'ISO 9001:2015'
    });

    const unsubscribe = subscribeToMetaEvents((event) => {
      setMetaEvents((prev) => [event, ...prev.slice(0, 49)]);
    });

    return unsubscribe;
  }, []);

  // Cart total count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    trackMetaEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: 'INR'
    });

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLeadCaptured = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    if (newLead.unlockedCoupon) {
      setUnlockedCoupon(newLead.unlockedCoupon);
    }

    // If Webhook is set up and valid, dispatch lead to Zapier/Make/CRM
    if (automationConfig.webhookUrl) {
      try {
        fetch(automationConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          body: JSON.stringify({
            event: 'lead_captured',
            lead: newLead,
            source: 'kanhaasa.com'
          })
        }).catch(() => {});
      } catch (err) {}
    }
  };

  const handleEnrollSip = (plan: SipPlan, customerDetails: { name: string; phone: string; frequency: string }) => {
    const sipLead: Lead = {
      id: `lead-sip-${Date.now().toString().slice(-5)}`,
      name: customerDetails.name,
      phone: customerDetails.phone,
      concern: `SIP Enrollment: ${plan.title} (${customerDetails.frequency})`,
      productInterest: `${plan.title} - ₹${plan.amount}/${customerDetails.frequency}`,
      utmSource: 'sip_section',
      utmMedium: 'direct_enrollment',
      utmCampaign: 'sanatana_rudraksha_sip',
      createdAt: new Date().toLocaleString(),
      status: 'new',
      unlockedCoupon: 'KANHA10',
      notes: `Enrolled in ${plan.title} (₹${plan.amount}). Unlocked 10% coupon code KANHA10.`
    };
    handleLeadCaptured(sipLead);
  };

  const handleUpdateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
  };

  const scrollToSection = (sectionId: string) => {
    setActiveView('store');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Real-time Meta Pixel Notification Toast */}
      <MetaEventToast />

      {/* Topmost Dream Rudraksha in Easy Installments Scrolling Ticker (As Requested) */}
      <TopDreamInstallmentTicker onOpenInstallments={() => scrollToSection('sip-plans')} />

      {/* Main Navigation (Complies with Top Bar Contract) */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        merchantPhone={automationConfig.merchantPhone}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenAiCalling={() => setIsAiCallingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'store' ? (
          <>
            {/* Top Nepal Rudraksha Trees Scrolling Ticker (As Requested: फ्रंट पे जब होम पेज हम खोलते हैं तो नेपाल के रुद्राक्ष के पेड़ फोटो स्क्रॉल होता रहे) */}
            <ScrollingTreeTicker />

            {/* Hero Section with Official Logo & AI Calling Triggers */}
            <Hero
              onFindMukhiClick={() => scrollToSection('mukhi-finder')}
              onExploreClick={() => scrollToSection('catalog')}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              onOpenAiCalling={() => setIsAiCallingOpen(true)}
              merchantPhone={automationConfig.merchantPhone}
            />

            {/* Mukhi Recommendation Calculator & 10% Coupon Unlocker */}
            <MukhiFinder
              onLeadCaptured={handleLeadCaptured}
              onSelectProduct={(p) => setSelectedProduct(p)}
              merchantPhone={automationConfig.merchantPhone}
            />

            {/* Complete 1 to 21 Mukhi Nepali Collection + Certificate Verification */}
            <ProductCatalog
              products={PRODUCTS}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              onOpenAiChat={() => setIsAiChatOpen(true)}
            />

            {/* Monthly, Quarterly & Half-Yearly SIP Section */}
            <SipPlans
              merchantPhone={automationConfig.merchantPhone}
              onEnrollSip={handleEnrollSip}
            />

            {/* Vedic Astrological Kundli Consultation */}
            <AstroConsultation
              onLeadCaptured={handleLeadCaptured}
              merchantPhone={automationConfig.merchantPhone}
              onOpenAiCalling={() => setIsAiCallingOpen(true)}
            />

            {/* Authenticity & Official ISO 9001:2015 Identification Report */}
            <AuthenticityGuarantee />

            {/* Customer Testimonials & Verified Devotee Proof */}
            <CustomerTestimonials />

            {/* Official YouTube Video Gallery & Social Media Hub (@kanhaasaastrorudraksha) */}
            <KanhaSocialHub />

            {/* Bottom News-Style Customer Feedback Marquee Ticker (As Requested: नीचे कस्टमर फीडबैक स्क्रॉल होता रहे, न्यूज की तरह चलता रहे) */}
            <FeedbackNewsTicker />

            {/* Promotional 10% Coupon & Festive Consecration Strip */}
            <div className="bg-amber-950/80 border-y border-amber-900/50 py-3.5 px-4 text-center text-xs flex flex-wrap items-center justify-center gap-3">
              <span className="text-amber-200">
                Claim 10% Discount Code: <strong className="text-white font-mono bg-stone-900 px-2 py-0.5 rounded border border-amber-500/60">KANHA10</strong> + Free Pan-India Shipping!
              </span>
              <button
                onClick={() => setIsQuickLeadOpen(true)}
                className="px-3.5 py-1.5 font-bold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors text-xs whitespace-nowrap cursor-pointer"
              >
                Claim Consecration Voucher
              </button>
            </div>
          </>
        ) : (
          /* Meta Ads, Lead Ads & WhatsApp Automation Hub */
          <MetaAdsCenter
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            metaEvents={metaEvents}
            automationConfig={automationConfig}
            onUpdateAutomationConfig={setAutomationConfig}
            onClose={() => setActiveView('store')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenMetaHub={() => {
          setActiveView('meta-hub');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenAiCalling={() => setIsAiCallingOpen(true)}
        merchantPhone={automationConfig.merchantPhone}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenAiChat={() => setIsAiChatOpen(true)}
      />

      {/* Cart Drawer with 10%, 15%, 25% Coupons and COD / Free Shipping Breakdown */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        merchantPhone={automationConfig.merchantPhone}
        appliedCoupon={unlockedCoupon}
      />

      {/* Quick Lead Modal */}
      <QuickLeadModal
        isOpen={isQuickLeadOpen}
        onClose={() => setIsQuickLeadOpen(false)}
        onLeadCaptured={handleLeadCaptured}
        merchantPhone={automationConfig.merchantPhone}
      />

      {/* AI Astrologer Chatbot Modal (Numerology, Lo Shu Grid, Pricing, Mukhi/Gemstone Recommendation) */}
      <AiAstrologerChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        merchantPhone={automationConfig.merchantPhone}
      />

      {/* AI Calling Modal (Outbound AI Calls directly to user, with Recharge plans) */}
      <AiCallingModal
        isOpen={isAiCallingOpen}
        onClose={() => setIsAiCallingOpen(false)}
        merchantPhone={automationConfig.merchantPhone}
      />

      {/* Persistent Floating WhatsApp Channel */}
      <FloatingWhatsApp
        merchantPhone={automationConfig.merchantPhone}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenAiCalling={() => setIsAiCallingOpen(true)}
      />
    </div>
  );
}

