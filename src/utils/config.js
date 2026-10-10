// Store rules - change these numbers to match your business.
export const FREE_DELIVERY_ABOVE = 499
export const DELIVERY_FEE = 40
export const MAX_QTY = 10

// Demo coupons (frontend only). Real coupons backend se validate hone chahiye.
export const COUPONS = {
  BAZAR10: { type: 'percent', value: 10, max: 100, min: 0, label: '10% off (max ₹100)' },
  WELCOME50: { type: 'flat', value: 50, min: 299, label: '₹50 off on orders above ₹299' },
}
