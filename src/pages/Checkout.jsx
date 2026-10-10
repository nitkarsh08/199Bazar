import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Summary } from './Cart'
import { useStore } from '../context/StoreContext'

const STATES = ['Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other']
const initial = { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', payment: 'cod' }

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}
const input = 'w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-brand'

export default function Checkout() {
  const { items, total } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  if (items.length === 0) return <Navigate to="/cart" replace />

  const on = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.address.trim().length < 8) e.address = 'Enter your full address'
    if (form.city.trim().length < 2) e.city = 'Enter your city'
    if (!form.state) e.state = 'Select your state'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) { document.querySelector('[data-invalid]')?.focus(); return }
    // TODO: send order to backend here (POST /orders). For now we only create a local order id.
    const orderId = 'BZ' + Date.now().toString().slice(-8)
    const summary = { orderId, total, payment: form.payment, name: form.name, city: form.city }
    // Cart is cleared on the success page, so this page does not redirect to /cart mid-navigation.
    navigate('/order-success', { replace: true, state: summary })
  }

  const attr = (k) => ({ className: input, value: form[k], onChange: on(k), ...(errors[k] ? { 'data-invalid': true, 'aria-invalid': true } : {}) })

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <h1 className="mb-5 text-2xl font-bold">Checkout</h1>
      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Delivery Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}><input {...attr('name')} autoComplete="name" /></Field>
              <Field label="Mobile number" error={errors.phone}><input {...attr('phone')} inputMode="numeric" maxLength={10} autoComplete="tel" placeholder="10-digit number" /></Field>
              <div className="sm:col-span-2"><Field label="Email (optional)" error={errors.email}><input {...attr('email')} type="email" autoComplete="email" /></Field></div>
              <div className="sm:col-span-2"><Field label="Address" error={errors.address}><textarea {...attr('address')} rows={3} autoComplete="street-address" placeholder="House no., street, area" /></Field></div>
              <Field label="City" error={errors.city}><input {...attr('city')} autoComplete="address-level2" /></Field>
              <Field label="State" error={errors.state}>
                <select {...attr('state')} autoComplete="address-level1"><option value="">Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
              </Field>
              <Field label="Pincode" error={errors.pincode}><input {...attr('pincode')} inputMode="numeric" maxLength={6} autoComplete="postal-code" /></Field>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Payment Method</h2>
            <div className="space-y-2">
              {[['cod', 'Cash on Delivery', 'Pay in cash when your order arrives'], ['upi', 'UPI', 'Google Pay, PhonePe, Paytm and more'], ['card', 'Credit / Debit Card', 'Visa, Mastercard, RuPay']].map(([v, t, s]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 ${form.payment === v ? 'border-brand bg-cream' : 'border-gray-100'}`}>
                  <input type="radio" name="payment" value={v} checked={form.payment === v} onChange={on('payment')} className="accent-orange-500" />
                  <span><span className="block text-sm font-semibold">{t}</span><span className="block text-xs text-gray-500">{s}</span></span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <Summary showCoupon={false} />
          <button type="submit" className="mt-4 w-full rounded-full bg-brand py-3.5 font-bold text-white transition hover:bg-brand-dark">Place Order</button>
        </aside>
      </form>
    </div>
  )
}
