import React, { useState } from 'react';
import { ShieldCheck, Award, Zap, FileText, CheckCircle2, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { OfficialCertificate } from './OfficialCertificate';

export const AuthenticityGuarantee: React.FC = () => {
  const [showCertModal, setShowCertModal] = useState(false);
  const sampleProduct = PRODUCTS.find((p) => p.id === 'prod-7-mukhi') || PRODUCTS[0];

  return (
    <section id="authenticity" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO 9001:2015 Certified Company</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white" style={{ textWrap: 'balance' }}>
            Official Kanha Asa Rudraksha Identification Reports
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-sans">
            Every 1 to 21 Mukhi Nepali bead and Sarva Siddh Mala carries the official Kanha Asa ISO 9001:2015 certificate with microscopic furrow analysis, X-Ray seed radiography, and IAF/EGAC accreditation.
          </p>
        </div>

        {/* Certificate Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          {/* Certificate Specimen Preview Card (7 cols) */}
          <div className="lg:col-span-7 bg-stone-900 border-2 border-amber-900/60 rounded-xl p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Live Certificate Specimen · C NO: KA0302202507F</span>
              </span>
              <button
                onClick={() => setShowCertModal(true)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect Full Certificate
              </button>
            </div>

            {/* Embedded Official Certificate Component */}
            <div className="rounded overflow-hidden shadow">
              <OfficialCertificate product={sampleProduct} isModal={false} />
            </div>
          </div>

          {/* Certificate Features Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 bg-stone-900/80 border border-stone-800 rounded-xl space-y-3">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Standardized 1 to 21 Mukhi Certification</span>
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Unlike third-party generic printouts, Kanha Asa issues authorized Rudraksha Identification Reports featuring:
              </p>

              <ul className="space-y-2 text-xs text-stone-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>X-Ray Seed Radiography:</strong> Proves presence of authentic internal seeds in every compartment with zero glue.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Botanical Authenticity:</strong> Certified Elaeocarpus / E. Ganitrus species originating from Nepal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Accreditation Seals:</strong> EGAC & IAF (International Accreditation Forum) recognized.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Authorized Signature:</strong> Signed by Anima for Kanha Asa TM.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => setShowCertModal(true)}
                  className="w-full py-2.5 px-4 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs border border-stone-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View High-Resolution Report & Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-lg space-y-2.5">
            <h4 className="text-base font-semibold text-white">01. 100% Himalayan Nepal Lineage</h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Hand-harvested from high-altitude trees in Nepal. Deep natural clefts, heavy grain density, and higher bio-electric capacitance.
            </p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-lg space-y-2.5">
            <h4 className="text-base font-semibold text-white">02. 1,008 Vedic Beej Mantras</h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Every bead is bathed in holy Ganga Jal, raw milk, and consecrated on your Gotra before shipping in sacred packaging.
            </p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-stone-800 rounded-lg space-y-2.5">
            <h4 className="text-base font-semibold text-white">03. Free Shipping & ₹150 COD</h4>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Pan-India free shipping on prepaid orders with safe insured delivery. Cash on delivery available at a nominal ₹150 charge.
            </p>
          </div>
        </div>
      </div>

      {/* Modal View */}
      {showCertModal && (
        <OfficialCertificate
          product={sampleProduct}
          isModal={true}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </section>
  );
};
