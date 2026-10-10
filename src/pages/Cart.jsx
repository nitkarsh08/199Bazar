import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Tag, Trash2 } from 'lucide-react'
import ProductImage from '../components/ProductImage'
import { useStore } from '../context/StoreContext'
import { COUPONS, FREE_DELIVERY_ABOVE } from '../utils/config'
import { inr } from '../utils/format'

export function Summary({ showCoupon = true }) {
  const { subtotal, mrpTotal, couponCode, couponDiscount, delivery, total, applyCoupon, removeCoupon } = useStore()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)
  const saved = mrpTotal - subtotal + couponDiscount

  const apply = (e) => {
    e.preventDefault()
    if (!code.trim()) return
    const r = applyCoupon(code)
    setMsg(r)
    if (r.ok) setCode('')
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Order Summary</h2>
      {showCoupon && (
        <div className="mt-4">
          {couponCode ? (
            <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">
              <span className="flex items-center gap-2"><Tag size={16} /> {couponCode} applied</span>
              <button type="button" onClick={removeCoupon} className="font-semibold underline">Remove</button>
            </div>
          ) : (
            <form onSubmit={apply} className="flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm uppercase outline-none focus:border-brand" />
              <button type="submit" className="rounded-xl bg-navy px-4 text-sm font-semibold text-white hover:bg-brand">Apply</button>
            </form>
          )}
          {msg && !couponCode && <p className={`mt-2 text-xs ${msg.ok ? 'text-green-600' : 'text-red-500'}`}>{msg.msg}</p>}
          {!couponCode && <p className="mt-2 text-xs text-gray-400">Try: {Object.keys(COUPONS).join(' or ')}</p>}
        </div>
      )}
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>{inr(subtotal)}</dd></div>
        {couponDiscount > 0 && <div className="flex justify-between text-green-600"><dt>Coupon discount</dt><dd>- {inr(couponDiscount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-gray-500">Delivery</dt><dd>{delivery === 0 ? <span className="font-semibold text-green-600">FREE</span> : inr(delivery)}</dd></div>
        <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{inr(total)}</dd></div>
      </dl>
      {saved > 0 && <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-center text-xs font-semibold text-brand-dark">🎉 You are saving {inr(saved)} on this order</p>}
    </div>
  )
}

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useStore()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you have not added anything yet.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-brand px-7 py-3 font-bold text-white hover:bg-brand-dark">Start Shopping</Link>
      </div>
    )
  }

  const need = FREE_DELIVERY_ABOVE - subtotal

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <h1 className="mb-5 text-2xl font-bold">Shopping Cart <span className="text-base font-medium text-gray-500">({items.length} {items.length === 1 ? 'item' : 'items'})</span></h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${need > 0 ? 'bg-cream text-brand-dark' : 'bg-green-50 text-green-700'}`}>
            {need > 0 ? `Add items worth ${inr(need)} more to get FREE delivery` : '🎉 You have unlocked FREE delivery!'}
          </p>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 sm:gap-4 sm:p-4">
                <Link to={`/product/${i.slug}`} className="block h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28"><ProductImage product={i} emojiSize="text-5xl" /></Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link to={`/product/${i.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-brand-dark sm:text-base">{i.name}</Link>
                  <p className="mt-1 text-sm"><span className="font-bold">{inr(i.price)}</span> <span className="text-xs text-gray-400 line-through">{inr(i.mrp)}</span></p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center overflow-hidden rounded-full border">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(i.id, i.qty - 1)} className="p-2 hover:bg-gray-100"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQty(i.id, i.qty + 1)} className="p-2 hover:bg-gray-100"><Plus size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold sm:text-base">{inr(i.price * i.qty)}</span>
                      <button type="button" onClick={() => removeFromCart(i.id)} aria-label={`Remove ${i.name}`} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="mt-4 inline-block text-sm font-semibold text-brand-dark hover:underline">← Continue shopping</Link>
        </div>
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <Summary />
          <button type="button" onClick={() => navigate('/checkout')} className="mt-4 w-full rounded-full bg-brand py-3.5 font-bold text-white transition hover:bg-brand-dark">Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  )
}
