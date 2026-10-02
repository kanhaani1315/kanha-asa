import React, { useState } from 'react';
import { Play, ExternalLink, ShieldCheck, CheckCircle2, Sparkles, X, Eye, Heart, Share2, Award, Youtube } from 'lucide-react';
import { YouTubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface VideoItem {
  id: string;
  title: string;
  titleHi: string;
  duration: string;
  category: string;
  views: string;
  description: string;
  thumbnailUrl: string;
  embedUrl?: string;
  youtubeLink: string;
  highlights: string[];
}

export const KanhaSocialHub: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const officialLinks = {
    youtube: 'https://www.youtube.com/@kanhaasaastrorudraksha',
    facebook: 'https://www.facebook.com/KanhaASA',
    instagram: 'https://www.instagram.com/kanha.asa/',
  };

  const videoList: VideoItem[] = [
    {
      id: 'v1',
      title: '1 to 21 Mukhi Nepali Rudraksha Identification & X-Ray Testing',
      titleHi: '1 से 21 मुखी असली नेपाली रुद्राक्ष की पहचान एवं एक्स-रे टेस्ट रिपोर्ट',
      duration: '14:20',
      category: 'Lab Verification',
      views: '48K+ Views',
      description: 'इस वीडियो में कान्हा असा के विशेषज्ञों द्वारा 1 से 21 मुखी असली नेपाली रुद्राक्ष की पहचान, प्राकृतिक धारियों की जांच और एक्स-रे लैब रिपोर्ट द्वारा आंतरिक बीज (Seeds/Chambers) का लाइव परीक्षण दिखाया गया है।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        'प्राकृतिक नेपाली दानों की पहचान',
        'लैब एक्स-रे में आंतरिक कक्ष (Chambers) देखना',
        'नकली और कटे हुए रुद्राक्ष से बचाव',
        'कान्हा असा ISO 9001:2015 लैब सर्टिफिकेट'
      ]
    },
    {
      id: 'v2',
      title: 'Vedic Rudraksha Consecration (Pran Pratishtha) & Abhishek Ritual',
      titleHi: 'सिद्ध रुद्राक्ष एवं सर्व सिद्ध माला की प्राण-प्रतिष्ठा व वैदिक पूजन',
      duration: '18:45',
      category: 'Sacred Ritual',
      views: '62K+ Views',
      description: 'हर एक रुद्राक्ष को डिस्पैच करने से पहले वैदिक ब्राह्मणों द्वारा गंगाजल, पंचामृत एवं महामृत्युंजय मंत्रों से विधिपूर्वक सिद्ध व जागृत किया जाता है। देखिए संपूर्ण प्राण-प्रतिष्ठा अनुष्ठान।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        'महामृत्युंजय संपुटित रुद्राभिषेक',
        'गंगाजल व पंचामृत शुद्धिकरण',
        'जागृत बीज मंत्रों द्वारा ऊर्जा प्रवाह',
        'प्राण-प्रतिष्ठा प्रमाणीकरण पत्र'
      ]
    },
    {
      id: 'v3',
      title: 'Kanha Asa Rewa Kendra Tour & Genuine Himalayan Bead Testing',
      titleHi: 'कान्हा असा रुद्राक्ष केंद्र (रीवा, म.प्र.) स्टोर व लैब दर्शन',
      duration: '09:15',
      category: 'Center Tour',
      views: '34K+ Views',
      description: 'शिल्पी प्लाजा, रीवा (मध्य प्रदेश) स्थित कान्हा असा के मुख्य कार्यालय एवं टेस्ट लैब का लाइव वीडियो। जानिए कैसे दूर-दराज के भक्त सीधे दुकान पर आते हैं और ऑनलाइन ऑर्डर करते हैं।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        'दुकान नं. BF3/3 शिल्पी प्लाजा, रीवा दर्शन',
        'सैकड़ों दुर्लभ रुद्राक्षों का लाइव संग्रह',
        'गोल्ड व सिल्वर वर्क में जड़ाऊ मालाएं',
        'हस्तनिर्मित सिद्ध लॉकेट व ब्रेसलेट'
      ]
    },
    {
      id: 'v4',
      title: 'How to Book 1 to 21 Mukhi Rudraksha on Easy Monthly Installments',
      titleHi: 'आसान मासिक किस्तों (SIP) में अपना मनचाहा रुद्राक्ष कैसे बुक करें?',
      duration: '07:50',
      category: 'Easy Installments',
      views: '29K+ Views',
      description: 'महंगे और दुर्लभ 1 से 21 मुखी रुद्राक्ष व सिद्ध मालाओं को बिना किसी अतिरिक्त ब्याज के ₹1000 या ₹5000 की मासिक किस्तों में सुरक्षित बुक करने का पूरा डिजिटल तरीका।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        '0% ब्याज व 0% छुपे शुल्क की गारंटी',
        'तुरंत डिजिटल रिजर्वेशन सर्टिफिकेट',
        'Razorpay व UPI से सुरक्षित किस्त भुगतान',
        'पूर्ण होते ही फ्री होम डिलीवरी'
      ]
    },
    {
      id: 'v5',
      title: 'Lo Shu Grid & Numerology: Which Rudraksha Suits Your Name & DOB?',
      titleHi: 'लो-शू ग्रिड व जन्मतिथि अनुसार भाग्यशाली रुद्राक्ष चयन विधि',
      duration: '12:30',
      category: 'Numerology & Astro',
      views: '53K+ Views',
      description: 'आपके नाम और जन्मतिथि में कौन से अंक लुप्त हैं? किस ग्रह की दशा चल रही है? जानिए अंक ज्योतिष और वैदिक कुंडली के अनुसार सबसे सटीक रुद्राक्ष धारण करने की विधि।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        'नाम व मोबाइल नंबर का न्यूमरोलॉजी योग',
        'मूलांक एवं भाग्यांक अनुसार रुद्राक्ष',
        'शनि, राहु-केतु व कालसर्प दोष शमन',
        'करियर व व्यापार में सफलता के योग'
      ]
    },
    {
      id: 'v6',
      title: 'Real Devotee Unboxing & Testimonials from Across India',
      titleHi: 'ग्राहकों का अनुभव एवं असली रुद्राक्ष पार्सल अनबॉक्सिंग वीडियो',
      duration: '11:10',
      category: 'Unboxing & Reviews',
      views: '41K+ Views',
      description: 'देश भर के भक्तों द्वारा कान्हा असा से प्राप्त किए गए पार्सल की लाइव अनबॉक्सिंग, गंगाजल डिब्बी, सिद्ध प्रमाणपत्र और रुद्राक्ष की दिव्यता पर उनके सच्चे विचार।',
      thumbnailUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      embedUrl: 'https://www.youtube-nocookie.com/embed?listType=user_uploads&list=kanhaasaastrorudraksha',
      youtubeLink: `${officialLinks.youtube}`,
      highlights: [
        'सुरक्षित टैम्पर-प्रूफ प्रीमियम पैकेजिंग',
        'ओरिजिनल लैब एक्स-रे रिपोर्ट व कार्ड',
        'गंगाजल व पूजन सामग्री साथ में',
        'भक्तों की सच्ची संतुष्टि व आशीर्वाद'
      ]
    }
  ];

  return (
    <section id="video-gallery" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <YouTubeIcon size={16} className="text-red-500 fill-current" />
              <span>Official Video & Social Media Hub</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white mt-1">
              कान्हा असा यूट्यूब वीडियो एवं सोशल मीडिया दर्शन
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-2xl leading-relaxed">
              असली हिमालयी नेपाली 1 से 21 मुखी रुद्राक्ष की पहचान, एक्स-रे लैब टेस्ट, वैदिक प्राण-प्रतिष्ठा एवं रीवा केंद्र के आधिकारिक वीडियो सीधे हमारे यूट्यूब चैनल पर देखें।
            </p>
          </div>

          {/* Direct Social Media Action Links */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={officialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all hover:scale-102"
            >
              <YouTubeIcon size={18} className="fill-current text-white" />
              <span>YouTube चैनल सब्सक्राइब करें</span>
            </a>

            <a
              href={officialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white font-semibold text-xs shadow-lg transition-all hover:scale-102"
            >
              <InstagramIcon size={16} className="fill-current text-white" />
              <span>Instagram @kanha.asa</span>
            </a>

            <a
              href={officialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg transition-all hover:scale-102"
            >
              <FacebookIcon size={16} className="fill-current text-white" />
              <span>Facebook @KanhaASA</span>
            </a>
          </div>
        </div>

        {/* 3 Prominent Social Channel Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {/* YouTube Channel Banner */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-red-900/40 hover:border-red-600/70 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <YouTubeIcon size={26} className="fill-current" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-800/60">
                  Official Channel
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                  @kanhaasaastrorudraksha
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  कान्हा असा का आधिकारिक यूट्यूब चैनल। 1-21 मुखी रुद्राक्ष पहचान, प्राण प्रतिष्ठा एवं कस्टमर रिव्यू वीडियो।
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-stone-300 pt-1">
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>लाइव रुद्राक्ष एक्स-रे व लैब टेस्टिंग</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>वैदिक अभिषेक व प्राण प्रतिष्ठा दर्शन</span>
                </p>
              </div>
            </div>
            <a
              href={officialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>यूट्यूब पर वीडियो देखें व सब्सक्राइब करें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Instagram Handle Banner */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-pink-900/40 hover:border-pink-500/70 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-500 group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white transition-colors">
                  <InstagramIcon size={26} className="fill-current" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-800/60">
                  Reels & Daily Darshan
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                  instagram.com/kanha.asa/
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  इंस्टाग्राम पर प्रतिदिन सिद्ध रुद्राक्ष दर्शन, दैनिक पंचांग, दुर्लभ रील्स एवं भक्तों के अनुभव देखें।
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-stone-300 pt-1">
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>दैनिक दुर्लभ रुद्राक्ष रील्स व स्टोरी</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>इंस्टाग्राम DM द्वारा परामर्श सुविधा</span>
                </p>
              </div>
            </div>
            <a
              href={officialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-opacity"
            >
              <span>इंस्टाग्राम पर फॉलो करें (@kanha.asa)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Facebook Official Page */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-blue-900/40 hover:border-blue-500/70 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FacebookIcon size={26} className="fill-current" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/60">
                  Vedic Community
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  facebook.com/KanhaASA
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  कान्हा असा का आधिकारिक फेसबुक पेज। वैदिक ज्योतिष, रुद्राक्ष महत्व एवं विशेष पूजा आयोजनों की जानकारी।
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-stone-300 pt-1">
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>वैदिक लेख व ग्रहों के ज्योतिषीय उपाय</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>संतुष्ट भक्तों की समीक्षाएं व रेटिंग्स</span>
                </p>
              </div>
            </div>
            <a
              href={officialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>फेसबुक पेज लाइक करें (KanhaASA)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Video Player Grid - People can directly browse & watch videos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                लोकप्रिय यूट्यूब वीडियो श्रृंखला (Featured Video Series)
              </h3>
            </div>
            <a
              href={officialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 font-semibold"
            >
              <span>सभी वीडियो यूट्यूब पर देखें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoList.map((video) => (
              <div
                key={video.id}
                className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-lg"
              >
                {/* Thumbnail with Play Overlay */}
                <div
                  onClick={() => setActiveVideo(video)}
                  className="relative aspect-video bg-stone-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.titleHi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-sm text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    {video.category}
                  </span>

                  {/* Duration Pill */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-stone-950/90 text-[11px] font-mono font-medium text-stone-200">
                    {video.duration}
                  </span>

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 group-hover:scale-110 text-white flex items-center justify-center shadow-xl shadow-red-950/60 transition-all duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {video.titleHi}
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      {video.views}
                    </span>
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-red-600 hover:text-white text-stone-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>वीडियो देखें</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Modal (When a video is clicked) */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                    <YouTubeIcon size={16} className="fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-400">Kanha Asa Official YouTube</p>
                    <p className="text-sm font-bold text-white line-clamp-1">{activeVideo.titleHi}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Area */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <img
                  src={activeVideo.thumbnailUrl}
                  alt={activeVideo.titleHi}
                  className="w-full h-full object-cover opacity-60"
                />
                
                {/* Center Action to watch on YouTube or player */}
                <div className="absolute inset-0 bg-stone-950/70 flex flex-col items-center justify-center p-6 text-center">
                  <a
                    href={officialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 hover:scale-110 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group mb-3"
                  >
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </a>
                  <h4 className="text-base sm:text-lg font-bold text-white max-w-lg mb-2">
                    {activeVideo.titleHi}
                  </h4>
                  <p className="text-xs text-stone-300 max-w-md mb-4 leading-relaxed">
                    यह संपूर्ण वीडियो और 1 से 21 मुखी रुद्राक्ष के सभी एपिसोड कान्हा असा के आधिकारिक यूट्यूब चैनल <strong className="text-amber-400">@kanhaasaastrorudraksha</strong> पर उपलब्ध हैं।
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={officialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
                    >
                      <YouTubeIcon size={16} className="fill-current text-white" />
                      <span>यूट्यूब चैनल पर पूरा वीडियो देखें</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={officialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold text-xs flex items-center gap-1.5 transition-opacity"
                    >
                      <InstagramIcon size={14} className="fill-current text-white" />
                      <span>Instagram रील्स देखें</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Modal Body / Info */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                <div>
                  <h5 className="font-semibold text-amber-400 mb-1">वीडियो विवरण (Video Summary):</h5>
                  <p className="text-stone-300 leading-relaxed">{activeVideo.description}</p>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-2">इस वीडियो में क्या सीखेंगे (Key Highlights):</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVideo.highlights.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>प्रमाणित ISO 9001:2015 रुद्राक्ष केंद्र रीवा (म.प्र.)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={officialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FacebookIcon size={13} className="fill-current" />
                      <span>Facebook @KanhaASA</span>
                    </a>
                    <span>•</span>
                    <a
                      href={officialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-400 hover:underline flex items-center gap-1"
                    >
                      <InstagramIcon size={13} className="fill-current" />
                      <span>Instagram @kanha.asa</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
