import React, { useState } from 'react';
import { KanhaLogo } from './KanhaLogo';
import { ShieldCheck, Printer, CheckCircle2, Lock, X, Award, FileText, Share2, AlertCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface InstallmentCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  customerPhone?: string;
  planTitle?: string;
  installmentAmount?: number;
  beadName?: string;
  merchantPhone: string;
}

export const InstallmentCertificateModal: React.FC<InstallmentCertificateModalProps> = ({
  isOpen,
  onClose,
  customerName = 'आदरणीय भक्त (Devotee)',
  customerPhone = '+91 91318 05622',
  planTitle = 'मासिक सिद्ध किस्त योजना (Monthly Sacred Siddh Installment)',
  installmentAmount = 1499,
  beadName = '14 मुखी देवमणि नेपाली रुद्राक्ष (14 Mukhi Devamani)',
  merchantPhone,
}) => {
  const [certCode] = useState(() => `KA-INST-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [beadVaultCode] = useState(() => `KAS-VAULT-NEP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate] = useState(() => new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }));

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const msg = `*श्री कान्हा असा - आसान किस्त आरक्षण प्रमाण पत्र* 🕉️\n\nप्रमाण पत्र संख्या: ${certCode}\nदाना आरक्षण कोड: ${beadVaultCode}\nयोजना: ${planTitle}\nआरक्षित दाना: ${beadName}\nकिस्त राशि: ₹${installmentAmount.toLocaleString('en-IN')}\n\nनियम: पहली किस्त से वही सेम दाना तिजोरी में रिजर्व रहेगा एवं पूर्ण भुगतान (100%) के पश्चात ISO 9001:2015 लैब सर्टिफिकेट सहित होम डिलीवर किया जाएगा।\n\nसत्यापित पोर्टल: www.kanhaasa.com`;
    const url = generateWhatsAppUrl(merchantPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-600/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar (Non-Printable) */}
        <div className="bg-stone-950 p-3.5 border-b border-stone-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              आधिकारिक आसान किस्त व सुरक्षित तिजोरी आरक्षण प्रमाण पत्र
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="WhatsApp पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="प्रमाण पत्र प्रिंट करें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">प्रिंट</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-4 sm:p-7 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-4 border-double border-amber-600/60 m-2 sm:m-3 rounded-xl relative space-y-4">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <KanhaLogo size={160} />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b-2 border-amber-600/40 pb-4">
            <div className="flex justify-center mb-1">
              <KanhaLogo size={60} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-amber-950/80 border border-amber-600/60 rounded-full text-[11px] font-mono text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 9001:2015 Certified Himalayan Research Foundation · Regd. No. KA/030225</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-amber-400 tracking-wide">
              पवित्र रुद्राक्ष आसान किस्त आरक्षण प्रमाण पत्र
            </h1>
            <p className="text-xs text-stone-300 font-sans tracking-wide">
              Official Sacred Rudraksha Easy Installment Plan & Safe Vault Reservation Certificate
            </p>
          </div>

          {/* Certificate Serial & Date Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-950/80 border border-stone-800 rounded-lg p-2.5 text-center text-xs">
            <div>
              <span className="text-[10px] text-stone-400 uppercase">प्रमाण पत्र संख्या</span>
              <p className="font-mono font-bold text-amber-300">{certCode}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase">आरक्षित दाना कोड (Locker)</span>
              <p className="font-mono font-bold text-emerald-400">{beadVaultCode}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase">किस्त योजना प्रकार</span>
              <p className="font-semibold text-white truncate">{planTitle}</p>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase">जारी दिनांक</span>
              <p className="font-mono text-stone-300">{issueDate}</p>
            </div>
          </div>

          {/* Beneficiary Details */}
          <div className="bg-stone-900/90 border border-amber-900/40 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">पंजीकृत भक्त / खाताधारक का नाम:</span>
              <span className="font-bold text-white text-sm">{customerName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">आरक्षित रुद्राक्ष स्वरूप (Reserved Sacred Bead):</span>
              <span className="font-bold text-amber-300 text-sm">{beadName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">प्रति किस्त देय राशि:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ₹{installmentAmount.toLocaleString('en-IN')} (0% ब्याज / Zero Hidden Charges)
              </span>
            </div>
          </div>

          {/* Core Terms & Conditions (नियम व शर्तें - As Requested by User) */}
          <div className="p-4 bg-stone-950/90 border border-stone-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>अनिवार्य नियम, शर्तें व सुरक्षा आश्वासन (Mandatory Terms of Agreement):</span>
            </div>

            <div className="space-y-2.5 text-xs text-stone-300 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5 p-2 bg-stone-900/70 rounded-lg border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-white">दाना पूर्ण भुगतान के पश्चात ही भेजा जाएगा (Delivery ONLY Post 100% Payment):</strong>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    यह स्पष्ट रूप से अनुबंधित है कि आरक्षित रुद्राक्ष दाना ग्राहक को तभी भेजा (डिस्पैच) किया जाएगा जब किस्त योजना का पूरा (100%) भुगतान सफलतापूर्वक पूरा हो जाएगा। अपूर्ण या बीच में भुगतान अधूरा रहने पर दाना प्रेषित नहीं किया जाएगा।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-stone-900/70 rounded-lg border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-white">वही सेम कोड का दाना पवित्र तिजोरी में आरक्षित (Exact Same Bead Locked in Vault):</strong>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    ग्राहक की प्रथम किस्त प्राप्त होते ही, आवंटित विशिष्ट पहचान कोड (<span className="text-emerald-400 font-mono font-bold">{beadVaultCode}</span>) का असली नेपाली रुद्राक्ष दाना कान्हा असा की पवित्र तिजोरी में ग्राहक के नाम व गोत्र से अभिमंत्रित करके सील कर दिया जाता है। यह दाना किसी अन्य व्यक्ति को नहीं दिया जाएगा। अंतिम किस्त पर ठीक वही सेम दाना ग्राहक को डिलीवर होगा।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-stone-900/70 rounded-lg border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-white">ISO 9001:2015 मूल लैब सर्टिफिकेट व प्राण-प्रतिष्ठा:</strong>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    अंतिम किस्त आने पर दाने की 1,008 बीजोक्त मंत्रों द्वारा प्राण-प्रतिष्ठा की जाएगी तथा मूल कान्हा असा ISO 9001:2015 पहचान पत्र, डिजिटल एक्स-रे कम्पार्टमेंट रिपोर्ट, पवित्र गंगाजल और लाल रेशमी धागे के साथ स्पीड पोस्ट से घर भेजा जाएगा।
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 bg-stone-900/70 rounded-lg border border-stone-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </span>
                <div>
                  <strong className="text-white">शून्य ब्याज (0% Interest) एवं संपूर्ण पारदर्शिता:</strong>
                  <p className="text-stone-400 text-[11px] mt-0.5">
                    आसान किस्तों पर कोई ब्याज, चक्रवृद्धि शुल्क या गुप्त प्रभार नहीं है। प्रत्येक किस्त जमा होने पर डिजिटल पावती तुरंत रजिस्टर्ड व्हाट्सएप (+91 {merchantPhone}) पर सुरक्षित रूप से भेजी जाएगी।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Seals & Signature */}
          <div className="pt-3 border-t border-amber-600/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-amber-500/80 bg-amber-950/60 flex items-center justify-center text-center p-1 text-[9px] font-bold text-amber-300 uppercase leading-tight shadow-md">
                <span>KANHA ASA SEAL 2026</span>
              </div>
              <div className="text-[11px] text-stone-400">
                <p className="font-semibold text-white">प्राधिकृत हस्ताक्षर एवं मुद्रा</p>
                <p>कान्हा असा हिमालयन रुद्राक्ष रिसर्च ट्रस्ट</p>
                <p className="text-emerald-400 font-mono">ISO 9001:2015 Certified Lab</p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px] text-stone-400">
              <p className="text-amber-400 font-semibold">हेल्पलाइन व किस्त सत्यापन:</p>
              <p className="font-mono text-white text-xs">+91 {merchantPhone}</p>
              <p className="text-[10px] text-stone-300">Shop No. BF3/3, Shilpi Plaza, Rewa (MP) - 486001</p>
              <p className="text-[10px] text-stone-500">आधिकारिक वेबसाइट: www.kanhaasa.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
