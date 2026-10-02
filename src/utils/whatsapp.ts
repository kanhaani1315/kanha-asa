/**
 * WhatsApp integration helpers for Kanha Asa
 */

export function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = cleanPhoneNumber(phoneNumber);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export function createProductOrderMessage(productName: string, price: number, mukhi?: string): string {
  return `*Pranam Kanha Asa!* 🕉️
I would like to order the authentic energized Rudraksha:
*Product:* ${productName} ${mukhi ? `(${mukhi})` : ''}
*Price:* ₹${price.toLocaleString('en-IN')}
*Benefits Required:* Lab Certified with Vedic Pooja Energization before dispatch.

Please share payment options (Cash on Delivery / UPI) and estimated delivery time.`;
}

export function createConsultationMessage(name: string, concern: string, birthDate?: string, rashi?: string): string {
  return `*Pranam Acharya Ji!* 🕉️
I would like a Vedic Astrology & Rudraksha Recommendation consultation.
*Name:* ${name}
*Primary Concern:* ${concern}
${birthDate ? `*Date of Birth:* ${birthDate}\n` : ''}${rashi ? `*Rashi / Zodiac:* ${rashi}\n` : ''}
Please guide me with the authentic energized Mukhi suited for my horoscope.`;
}

export function createLeadFollowupMessage(leadName: string, concern: string, merchantPhone: string): string {
  return `Namaste ${leadName} ji! 🕉️
We received your inquiry regarding *${concern}* on Kanha Asa (www.kanhaasa.com).
Our Vedic Astrologer has prepared your energized Nepali Rudraksha recommendation report.

Would you prefer a 5-minute telephonic guidance or would you like us to share your chart analysis right here on WhatsApp?`;
}

export function createCartWhatsAppMessage(items: { name: string; quantity: number; price: number }[], total: number): string {
  const itemList = items.map((item, i) => `${i + 1}. ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n');
  return `*Kanha Asa - Sacred Order Request* 🕉️
I want to confirm my order for:
${itemList}

*Total Amount:* ₹${total.toLocaleString('en-IN')}
*Special Request:* Include Free Lab Certificate & Acharya Pooja Energization.

My delivery address is:
Name:
City & Pincode:
Phone:`;
}
