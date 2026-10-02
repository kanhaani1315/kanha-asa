import React, { useState } from 'react';
import { Product } from '../types';
import { KanhaLogo } from './KanhaLogo';
import { ShieldCheck, Printer, CheckCircle2, Download, Upload, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface OfficialCertificateProps {
  product: Product;
  onClose?: () => void;
  isModal?: boolean;
  canToggleVisibility?: boolean;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  product,
  onClose,
  isModal = false,
  canToggleVisibility = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [customCertImage, setCustomCertImage] = useState<string | null>(null);
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const mukhiNumber = product.mukhiCount || '7 Mukhi';
  const certNumber = product.certificateNumber || `KA030220250${product.id.slice(-2)}F`;
  const weight = product.weightGms || '04.12Gms';
  const dimensions = product.dimensionsMm || '20mm';
  const compartments = product.xrayCompartments || mukhiNumber;

  const handlePrint = () => {
    window.print();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomCertImage(event.target.result as string);
          setShowUploadInput(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setCustomCertImage(inputUrl.trim());
      setShowUploadInput(false);
      setInputUrl('');
    }
  };

  const certificateBody = customCertImage ? (
    <div className="relative bg-white text-stone-900 border-4 border-stone-900 rounded-sm p-4 shadow-2xl max-w-2xl w-full mx-auto font-sans select-none overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-stone-300">
        <div className="flex items-center gap-2">
          <KanhaLogo size={36} />
          <div>
            <h4 className="font-bold text-red-600 font-display text-sm leading-none">KANHA ASA TM</h4>
            <p className="text-[10px] text-stone-600">Official Uploaded Lab Certificate</p>
          </div>
        </div>
        <button
          onClick={() => setCustomCertImage(null)}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Kanha Asa ISO Report</span>
        </button>
      </div>

      <div className="mt-3 aspect-[4/3] rounded overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center">
        <img
          src={customCertImage}
          alt="Custom Kanha Asa Certificate"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="mt-3 pt-2 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-600">
        <span>C NO: {certNumber}</span>
        <span className="text-emerald-700 font-bold">Kanha Asa Verified Authenticity</span>
      </div>
    </div>
  ) : (
    <div className="relative bg-white text-stone-900 border-4 border-stone-900 rounded-sm p-4 sm:p-6 shadow-2xl max-w-2xl w-full mx-auto font-sans select-none overflow-hidden print:m-0 print:border-2">
      {/* Central Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="text-center font-bold text-6xl tracking-widest text-red-950 font-display rotate-[-25deg]">
          KANHA ASA<br />100% GENUINE<br />SATISFACTION
        </div>
      </div>

      {/* Right Edge Vertical URL */}
      <div className="absolute right-1.5 top-0 bottom-0 flex items-center justify-center pointer-events-none">
        <span className="text-[10px] tracking-widest text-blue-700 font-bold rotate-90 whitespace-nowrap">
          www.kanhaasa.com
        </span>
      </div>

      {/* Certificate Header */}
      <div className="border-b-2 border-stone-300 pb-3 flex items-start justify-between gap-3">
        {/* Left Stamp / Logo */}
        <div className="flex flex-col items-center shrink-0">
          <KanhaLogo size={54} />
          <span className="text-[8px] font-bold text-stone-600 mt-1 font-mono">KANHA ASA TM</span>
        </div>

        {/* Center Title Lockup */}
        <div className="flex-1 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-red-600 font-display drop-shadow-sm leading-none">
            KANHA ASA<sup className="text-xs">TM</sup>
          </h2>
          <p className="text-[11px] font-semibold text-stone-700 mt-0.5">
            ISO 9001:2015 certified company
          </p>
          <div className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded">
            <span className="text-xs sm:text-sm font-extrabold tracking-wide text-blue-800 font-sans">
              RUDRAKSHA IDENTIFICATION REPORT
            </span>
          </div>
        </div>

        {/* Right QR Code & Certified script */}
        <div className="flex flex-col items-center shrink-0 pr-4">
          <div className="w-13 h-13 border border-stone-800 p-0.5 bg-white">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="0" y="0" width="100" height="100" fill="#fff" />
              <rect x="5" y="5" width="28" height="28" fill="#000" />
              <rect x="9" y="9" width="20" height="20" fill="#fff" />
              <rect x="13" y="13" width="12" height="12" fill="#000" />
              <rect x="67" y="5" width="28" height="28" fill="#000" />
              <rect x="71" y="9" width="20" height="20" fill="#fff" />
              <rect x="75" y="13" width="12" height="12" fill="#000" />
              <rect x="5" y="67" width="28" height="28" fill="#000" />
              <rect x="9" y="71" width="20" height="20" fill="#fff" />
              <rect x="13" y="75" width="12" height="12" fill="#000" />
              <rect x="40" y="8" width="6" height="6" fill="#000" />
              <rect x="52" y="8" width="6" height="14" fill="#000" />
              <rect x="40" y="24" width="18" height="6" fill="#000" />
              <rect x="12" y="44" width="8" height="14" fill="#000" />
              <rect x="28" y="40" width="14" height="8" fill="#000" />
              <rect x="48" y="38" width="10" height="18" fill="#000" />
              <rect x="66" y="44" width="16" height="8" fill="#000" />
              <rect x="44" y="68" width="8" height="16" fill="#000" />
              <rect x="60" y="64" width="18" height="8" fill="#000" />
              <rect x="78" y="76" width="14" height="12" fill="#000" />
            </svg>
          </div>
          <span className="text-xs font-serif-luxury font-bold text-stone-900 mt-0.5">Certified</span>
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-12 gap-4 pt-3.5 pb-2">
        {/* Left Column: Technical Laboratory Findings (7 cols) */}
        <div className="col-span-12 sm:col-span-7 space-y-1.5 text-xs text-stone-800">
          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Color :</span>
            <span className="col-span-3 text-stone-700">Brown</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Mounted :</span>
            <span className="col-span-3 text-stone-700">Unmounted / Silver Capping Available</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Weight :</span>
            <span className="col-span-3 font-semibold text-stone-900 tabular-nums">{weight}</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Dimensions :</span>
            <span className="col-span-3 text-stone-700 tabular-nums">{dimensions}</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Shape :</span>
            <span className="col-span-3 text-stone-700">Oval / Round</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Natural Faces :</span>
            <span className="col-span-3 font-bold text-stone-950 uppercase">{mukhiNumber.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Artificial Faces :</span>
            <span className="col-span-3 text-emerald-800 font-semibold">None (No Glue / No Carving)</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Test Carried Out :</span>
            <span className="col-span-3 text-stone-700">X-Rays, Magnification</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">Conclusions :</span>
            <span className="col-span-3 font-semibold text-stone-900">Results Confirm Natural Origin</span>
          </div>

          <div className="grid grid-cols-5 py-0.5">
            <span className="col-span-2 font-bold text-stone-900">X-Ray Results :</span>
            <span className="col-span-3 text-[11px] leading-tight text-stone-700">
              X-Ray Shows Natural Seed Inside & {compartments} Compartment Observed
            </span>
          </div>

          {/* Genus & Origin Highlight */}
          <div className="pt-2 border-t border-stone-200 space-y-0.5">
            <p className="text-[11px] font-bold text-stone-900">
              GENUS/TYPE : <span className="font-serif italic font-normal text-stone-700">ELAEOCARPUS/E. GANITRUS</span>
            </p>
            <p className="text-sm font-extrabold text-red-600 tracking-wider">
              ORIGIN : NEPAL
            </p>
          </div>
        </div>

        {/* Right Column: Specimen Image, Certificate Number, Signature, Seals (5 cols) */}
        <div className="col-span-12 sm:col-span-5 flex flex-col justify-between items-center text-center space-y-2.5 pr-2">
          {/* Natural Mukhi Title */}
          <h3 className="text-base font-bold text-red-600 leading-tight">
            Natural {mukhiNumber} Rudraksha
          </h3>

          {/* Actual Rudraksha Specimen Image Box */}
          <div className="w-28 h-28 border-2 border-stone-900 rounded bg-stone-100 p-1 shadow-inner overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

          {/* Certificate Number */}
          <div className="font-mono text-xs font-bold text-stone-900">
            C NO: <span className="text-stone-950 font-extrabold">{certNumber}</span>
          </div>

          {/* Signature & Brand Stamp */}
          <div className="space-y-0.5">
            <div className="font-serif italic text-sm text-blue-900 font-bold select-none">
              Anima
            </div>
            <div className="text-[11px] font-extrabold tracking-wider text-red-600 font-display">
              KANHA ASA
            </div>
          </div>

          {/* Accreditation Seals (EGAC, IAF, TESTED) */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="border border-stone-400 rounded px-1 py-0.5 text-[8px] font-bold text-stone-800 bg-stone-50">
              EGAC
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-blue-800 bg-blue-900 text-white flex items-center justify-center text-[8px] font-bold">
              IAF
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-red-700 bg-amber-500 text-stone-950 flex flex-col items-center justify-center text-[7px] font-extrabold leading-none shadow-sm">
              <span>TESTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Assurance Banner */}
      <div className="mt-3 pt-2 border-t-2 border-stone-300 flex items-center justify-between text-[10px] text-stone-600 font-medium">
        <span>ISO 9001:2015 Accredited Gemological Certification</span>
        <span className="text-emerald-700 font-bold">100% Genuine Himalayan Origin Guaranteed</span>
      </div>
    </div>
  );

  const controlsBar = (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-semibold">Certificate Controls:</span>
        <button
          onClick={() => setShowUploadInput(!showUploadInput)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>Upload/Change Certificate</span>
        </button>

        <button
          onClick={() => setIsVisible(!isVisible)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
        >
          {isVisible ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isVisible ? 'Hide Certificate' : 'Show Certificate'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
        <div className="relative max-w-3xl w-full my-8 space-y-3">
          <div className="flex items-center justify-between text-white px-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kanha Asa ISO 9001:2015 Identification Report</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>

          {/* Interactive Controls */}
          {controlsBar}

          {/* Image Upload Drawer */}
          {showUploadInput && (
            <div className="p-4 bg-stone-900 border border-amber-900/60 rounded-lg text-xs space-y-3">
              <p className="font-semibold text-white">Upload Your Original Certificate Image or Enter URL:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-stone-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-stone-950 file:font-semibold cursor-pointer"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste certificate image URL..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                  />
                  <button
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {isVisible ? certificateBody : (
            <div className="p-8 bg-stone-900 border border-stone-800 rounded-lg text-center text-xs text-stone-400">
              <EyeOff className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p>Certificate is currently hidden as requested.</p>
              <button
                onClick={() => setIsVisible(true)}
                className="mt-2 text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Restore Kanha Asa Certificate Preview
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {controlsBar}
      {isVisible ? certificateBody : null}
    </div>
  );
};

