import { MetaEvent } from '../types';

type EventListener = (event: MetaEvent) => void;
const listeners: EventListener[] = [];

// In-memory event log for live Meta Ads monitor
let eventHistory: MetaEvent[] = [
  {
    id: 'evt-001',
    eventName: 'PageView',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
    payload: { page: 'Home', url: 'https://kanhaasa.com/' },
    status: 'Dispatched'
  }
];

export function subscribeToMetaEvents(listener: EventListener): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function getMetaEventHistory(): MetaEvent[] {
  return [...eventHistory];
}

/**
 * Fires a Meta standard event (simulating fbq('track', eventName, payload))
 */
export function trackMetaEvent(
  eventName: MetaEvent['eventName'],
  payload: Record<string, any> = {},
  customPixelId?: string
): MetaEvent {
  const pixelId = customPixelId || '182930491029384';
  
  // Attach UTM parameters automatically
  const utmParams = getUtmParameters();
  const enrichedPayload = {
    ...payload,
    ...utmParams,
    pixelId,
    timestamp: new Date().toISOString(),
  };

  const newEvent: MetaEvent = {
    id: `evt-${Date.now().toString().slice(-6)}`,
    eventName,
    timestamp: new Date().toLocaleTimeString(),
    payload: enrichedPayload,
    status: 'Dispatched'
  };

  eventHistory = [newEvent, ...eventHistory.slice(0, 49)];

  // Also simulate window.fbq if available
  if (typeof window !== 'undefined') {
    if ((window as any).fbq) {
      (window as any).fbq('track', eventName, enrichedPayload);
    }
    // Also dispatch DOM event for any other widget
    window.dispatchEvent(new CustomEvent('kanhaasa_meta_event', { detail: newEvent }));
  }

  // Notify active listeners
  listeners.forEach(fn => fn(newEvent));

  return newEvent;
}

/**
 * Extract UTM tags from current URL
 */
export function getUtmParameters(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utmData: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid'].forEach(key => {
    const val = params.get(key);
    if (val) utmData[key] = val;
  });

  // Default values if no UTM present (typical for testing Meta campaigns)
  if (!utmData['utm_source']) {
    utmData['utm_source'] = 'meta_ads';
    utmData['utm_campaign'] = 'diwali_rudraksha_lead_campaign';
  }

  return utmData;
}
