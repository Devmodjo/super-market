import { formatPrice } from './productData';

// Official SUPERMARKET Phone Numbers
// Order Receiver WhatsApp Phone Number: +237 692 64 97 75
export const OFFICIAL_ORDER_WHATSAPP_NUMBER = '237692649775';
export const OFFICIAL_WHATSAPP_NUMBER = OFFICIAL_ORDER_WHATSAPP_NUMBER; 
export const FOOTER_CONTACT_NUMBER = '+237 694 47 01 59';
export const FOOTER_CONTACT_NUMBER_CLEAN = '237694470159';
export const OFFICIAL_COMMUNITY_LINK = 'https://chat.whatsapp.com/SuperMarketCommunityCM';

/**
 * Validate Cameroonian phone numbers
 * Accepts formats: +237 690000000, 237690000000, 690000000, 6 90 00 00 00
 * @param {string} phone 
 * @returns {boolean}
 */
export function validateCameroonPhone(phone) {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  // Should end in 9 digits starting with 6 (e.g. 690000000 or 237690000000)
  const pattern = /^(?:237)?6[5-9][0-9]{7}$/;
  return pattern.test(cleanPhone);
}

/**
 * Build pre-filled WhatsApp click-to-chat URL
 * @param {Object} options
 * @param {Object} options.product - Product object
 * @param {number} options.quantity - Order quantity
 * @param {string} options.customerName - Name of client or company
 * @param {string} options.phone - Client phone number
 * @param {string} options.deliveryMode - 'Livraison sur site' | 'Retrait en agence'
 * @param {string} [options.address] - Delivery address details
 * @param {string} [options.targetPhone] - Recipient phone number (default OFFICIAL_WHATSAPP_NUMBER)
 * @returns {string} wa.me URL
 */
export function buildWhatsAppUrl({
  product,
  quantity = 1,
  customerName = '',
  phone = '',
  deliveryMode = 'Livraison sur site',
  address = '',
  targetPhone = OFFICIAL_WHATSAPP_NUMBER
}) {
  const unitPriceFormatted = formatPrice(product?.prix || 0);
  const totalPriceFormatted = formatPrice((product?.prix || 0) * (quantity || 1));
  
  let messageLines = [
    `Bonjour SUPERMARKET 👋, je souhaite passer une commande :`,
    ``,
    `• *Article* : ${product?.nom || 'Produit'} (${product?.reference || ''})`,
    `• *Quantité* : ${quantity}`,
    `• *Prix unitaire* : ${unitPriceFormatted}`,
    `• *Montant total est.* : ${totalPriceFormatted}`,
    `• *Conditionnement* : ${product?.conditionnement || 'Unité'}`,
    ``,
    `📋 *Coordonnées client* :`,
    `• *Nom* : ${customerName}`,
    `• *Téléphone WhatsApp* : ${phone}`,
    `• *Mode de reception* : ${deliveryMode}`
  ];

  if (deliveryMode === 'Livraison sur site' && address.trim()) {
    messageLines.push(`• *Adresse de livraison* : ${address.trim()}`);
  }

  messageLines.push(``);
  messageLines.push(`Merci de me confirmer la disponibilité et le délai de traitement !`);

  const fullMessage = messageLines.join('\n');
  const encodedMessage = encodeURIComponent(fullMessage);
  
  const cleanTargetPhone = targetPhone.replace(/[\s\+]/g, '');
  return `https://wa.me/${cleanTargetPhone}?text=${encodedMessage}`;
}
