export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')
export const discountPct = (p) => Math.round((1 - p.price / p.mrp) * 100)
