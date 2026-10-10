import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'
import { COUPONS, DELIVERY_FEE, FREE_DELIVERY_ABOVE, MAX_QTY } from '../utils/config'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('bz_cart', []))
  const [wishlist, setWishlist] = useState(() => load('bz_wish', []))
  const [couponCode, setCouponCode] = useState(() => load('bz_coupon', null))
  const [toast, setToast] = useState(null)

  useEffect(() => save('bz_cart', cart), [cart])
  useEffect(() => save('bz_wish', wishlist), [wishlist])
  useEffect(() => save('bz_coupon', couponCode), [couponCode])

  const notify = useCallback((msg) => setToast({ msg, id: Date.now() }), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const addToCart = useCallback((id, qty = 1, silent = false) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === id)
      if (found) return prev.map((c) => (c.id === id ? { ...c, qty: Math.min(MAX_QTY, c.qty + qty) } : c))
      return [...prev, { id, qty: Math.min(MAX_QTY, qty) }]
    })
    if (!silent) notify('Added to cart')
  }, [notify])

  const updateQty = useCallback((id, qty) => {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : c)))
  }, [])
  const removeFromCart = useCallback((id) => setCart((prev) => prev.filter((c) => c.id !== id)), [])
  const clearCart = useCallback(() => { setCart([]); setCouponCode(null) }, [])

  const toggleWishlist = useCallback((id) => {
    const has = wishlist.includes(id)
    setWishlist((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]))
    notify(has ? 'Removed from wishlist' : 'Saved to wishlist')
  }, [wishlist, notify])

  const items = useMemo(
    () => cart.map((c) => ({ ...products.find((p) => p.id === c.id), qty: c.qty })).filter((i) => i.id),
    [cart],
  )
  const cartCount = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const mrpTotal = items.reduce((n, i) => n + i.mrp * i.qty, 0)

  const coupon = couponCode ? COUPONS[couponCode] : null
  const couponValid = Boolean(coupon) && subtotal >= coupon.min
  const couponDiscount = couponValid
    ? coupon.type === 'percent'
      ? Math.min(coupon.max, Math.round((subtotal * coupon.value) / 100))
      : coupon.value
    : 0
  const delivery = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = subtotal - couponDiscount + delivery

  const applyCoupon = useCallback((raw) => {
    const code = raw.trim().toUpperCase()
    const c = COUPONS[code]
    if (!c) return { ok: false, msg: 'Invalid coupon code' }
    if (subtotal < c.min) return { ok: false, msg: `Add items worth ₹${c.min - subtotal} more to use ${code}` }
    setCouponCode(code)
    return { ok: true, msg: `${code} applied: ${c.label}` }
  }, [subtotal])
  const removeCoupon = useCallback(() => setCouponCode(null), [])

  const value = {
    items, cartCount, subtotal, mrpTotal, delivery, total,
    couponCode: couponValid ? couponCode : null, couponDiscount,
    wishlist, addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, applyCoupon, removeCoupon, notify,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && (
        <div key={toast.id} role="status"
          className="toast-pop fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white shadow-lg md:bottom-8">
          {toast.msg}
        </div>
      )}
    </StoreContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
