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
    youtube: 'https://www.youtube.com/@kanhaasaastrorudraksha?sub_confirmation=1',
    facebook: 'https://www.facebook.com/KanhaASA',
    instagram: 'https://www.instagram.com/kanha.asa/',
  };

  const videoList: VideoItem[] = [
    {
      id: "w29s7XBWz9k",
      title: "असली रुद्राक्ष की पहचान कैसे करें? | Lab Certified Rudraksha",
      titleHi: "असली रुद्राक्ष की पहचान कैसे करें? | Lab Certified Rudraksha",
      duration: "10:02",
      category: "पहचान (Identification)",
      views: 'YouTube पर देखें',
      description: "असली और नकली रुद्राक्ष की पहचान कैसे करें, lab certification क्यों ज़रूरी है — Kanha Asa expert की free सलाह।",
      thumbnailUrl: 'https://i.ytimg.com/vi/w29s7XBWz9k/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/w29s7XBWz9k?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=w29s7XBWz9k',
      highlights: []
    },
    {
      id: "w-fN-mzSvBY",
      title: "रुद्राक्ष को अभिमंत्रित कैसे करें? | Rudraksh Siddh Karne ki Vidhi",
      titleHi: "रुद्राक्ष को अभिमंत्रित कैसे करें? | Rudraksh Siddh Karne ki Vidhi",
      duration: "10:58",
      category: "पूजन विधि",
      views: 'YouTube पर देखें',
      description: "रुद्राक्ष को सिद्ध / अभिमंत्रित करने की पूरी विधि, step by step।",
      thumbnailUrl: 'https://i.ytimg.com/vi/w-fN-mzSvBY/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/w-fN-mzSvBY?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=w-fN-mzSvBY',
      highlights: []
    },
    {
      id: "6rsZTW0kXig",
      title: "क्या आपको पता है कि हर 1 मुखी रुद्राक्ष असली नहीं होता?",
      titleHi: "क्या आपको पता है कि हर 1 मुखी रुद्राक्ष असली नहीं होता?",
      duration: "2:00",
      category: "1 मुखी",
      views: 'YouTube पर देखें',
      description: "1 मुखी रुद्राक्ष खरीदने से पहले ये बातें ज़रूर जानें।",
      thumbnailUrl: 'https://i.ytimg.com/vi/6rsZTW0kXig/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/6rsZTW0kXig?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=6rsZTW0kXig',
      highlights: []
    },
    {
      id: "MfdE-5gPqWg",
      title: "गौरी शंकर रुद्राक्ष के 5 चमत्कारी प्रभाव और लाभ",
      titleHi: "गौरी शंकर रुद्राक्ष के 5 चमत्कारी प्रभाव और लाभ",
      duration: "1:32",
      category: "गौरी शंकर",
      views: 'YouTube पर देखें',
      description: "गौरी शंकर रुद्राक्ष के मुख्य लाभ और किसे धारण करना चाहिए।",
      thumbnailUrl: 'https://i.ytimg.com/vi/MfdE-5gPqWg/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/MfdE-5gPqWg?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=MfdE-5gPqWg',
      highlights: []
    },
    {
      id: "l6e9SWX2yZU",
      title: "How We Pack & Dispatch Your Original Rudraksha | KANHA ASA",
      titleHi: "How We Pack & Dispatch Your Original Rudraksha | KANHA ASA",
      duration: "0:37",
      category: "Packing & Delivery",
      views: 'YouTube पर देखें',
      description: "आपका रुद्राक्ष कैसे pack और dispatch होता है — Kanha Asa का process।",
      thumbnailUrl: 'https://i.ytimg.com/vi/l6e9SWX2yZU/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/l6e9SWX2yZU?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=l6e9SWX2yZU',
      highlights: []
    },
    {
      id: "jfVXy2RDmec",
      title: "रुद्राक्ष की खेती कैसे होती है? पेड़ से आप तक का पूरा सफर",
      titleHi: "रुद्राक्ष की खेती कैसे होती है? पेड़ से आप तक का पूरा सफर",
      duration: "0:51",
      category: "रुद्राक्ष की खेती",
      views: 'YouTube पर देखें',
      description: "रुद्राक्ष के पेड़ से लेकर आप तक पहुँचने का पूरा सफर।",
      thumbnailUrl: 'https://i.ytimg.com/vi/jfVXy2RDmec/hqdefault.jpg',
      embedUrl: 'https://www.youtube-nocookie.com/embed/jfVXy2RDmec?rel=0&modestbranding=1&autoplay=1',
      youtubeLink: 'https://www.youtube.com/watch?v=jfVXy2RDmec',
      highlights: []
    }
  ];

  return (
    <section id="video-gallery" className="py-16 sm:py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
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
                <span className="text-[13px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-800/60">
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
              <div className="space-y-1 text-[13px] text-stone-300 pt-1">
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
                <span className="text-[13px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-800/60">
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
              <div className="space-y-1 text-[13px] text-stone-300 pt-1">
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
                <span className="text-[13px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/60">
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
              <div className="space-y-1 text-[13px] text-stone-300 pt-1">
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
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-sm text-[12px] font-semibold text-amber-300 border border-amber-500/30">
                    {video.category}
                  </span>

                  {/* Duration Pill */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-stone-950/90 text-[13px] font-mono font-medium text-stone-200">
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

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[13px] text-stone-400">
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
              <div className="relative aspect-video bg-black">
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.titleHi}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Body / Info */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                <div>
                  <h5 className="font-semibold text-amber-400 mb-1">वीडियो विवरण (Video Summary):</h5>
                  <p className="text-stone-300 leading-relaxed">{activeVideo.description}</p>
                </div>

                {activeVideo.highlights.length > 0 && <div>
                  <h5 className="font-semibold text-white mb-2">इस वीडियो में क्या सीखेंगे (Key Highlights):</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVideo.highlights.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 text-stone-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>}

                <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-stone-400">
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
