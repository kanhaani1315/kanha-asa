import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';

const NEPAL_TREE_1 = '/src/assets/images/nepal_rudraksha_tree_1790920222059.jpg';
const NEPAL_TREE_2 = '/src/assets/images/nepal_sacred_grove_1790920237187.jpg';

export const ScrollingTreeTicker: React.FC = () => {
  const treeSlides = [
    {
      img: NEPAL_TREE_1,
      title: 'Himalayan Ridge, Nepal',
      caption: 'Ancient Elaeocarpus Ganitrus Sacred Tree Grove'
    },
    {
      img: NEPAL_TREE_2,
      title: 'Sankhuwasabha Foothills, Nepal',
      caption: 'Natural Blue Rudraksha Fruit Fresh on Branch'
    },
    {
      img: NEPAL_TREE_1,
      title: 'Dharan & Taplejung Sanctuary',
      caption: 'Organic Himalayan Soil & High Altitude Growth'
    },
    {
      img: NEPAL_TREE_2,
      title: 'Pashupatinath Valley Lineage',
      caption: 'Pure Nepali Botanical Harvesting without Chemicals'
    },
    {
      img: NEPAL_TREE_1,
      title: 'Eastern Nepal Foothills',
      caption: 'Rare 1 to 21 Mukhi Trees in Full Bloom'
    },
    {
      img: NEPAL_TREE_2,
      title: 'Panchthar Himalayan Slopes',
      caption: '100% Authentic Nepali Origin Seed Trees'
    }
  ];

  return (
    <div className="relative bg-stone-950 border-b border-amber-900/40 overflow-hidden py-3">
      {/* Title Tag */}
      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between text-xs text-stone-400">
        <span className="flex items-center gap-2 text-amber-400 font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="uppercase text-[11px] font-bold">नेपाल के रुद्राक्ष के पेड़ · Live Himalayan Tree Groves</span>
        </span>
        <span className="hidden sm:flex items-center gap-1 text-[11px] text-stone-400">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Hand-Harvested at 8,000+ Feet Altitude in Nepal</span>
        </span>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex gap-4 w-max items-center">
          {[...treeSlides, ...treeSlides].map((slide, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-stone-900/90 border border-stone-800 rounded-lg p-2 pr-4 shadow-md shrink-0 hover:border-amber-700/60 transition-colors"
            >
              <img
                src={slide.img}
                alt={slide.caption}
                referrerPolicy="no-referrer"
                className="w-18 h-14 object-cover rounded-md border border-amber-900/40 shadow-sm"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">
                    {slide.title}
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-semibold rounded">
                    Nepal
                  </span>
                </div>
                <p className="text-xs font-semibold text-white tracking-wide max-w-xs truncate">
                  {slide.caption}
                </p>
                <p className="text-[10px] text-stone-400 font-mono">
                  100% Genuine Himalayan Botanical Tree
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

