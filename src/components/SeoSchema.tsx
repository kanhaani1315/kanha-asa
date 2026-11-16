import { useEffect } from 'react';
import { PRODUCTS } from '../data/mockData';

const SITE = 'https://rudrakshkanhaasa.shop';

// Adds Product structured data for every catalog item so Google can show price and stock.
export function SeoSchema() {
  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: PRODUCTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          description: p.description,
          image: p.image.startsWith('http') ? p.image : SITE + p.image,
          brand: { '@type': 'Brand', name: 'Kanha Asa' },
          offers: {
            '@type': 'Offer',
            url: SITE + '/',
            priceCurrency: 'INR',
            price: p.price,
            availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
          },
        },
      })),
    };
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'products-jsonld';
    el.text = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, []);
  return null;
}
