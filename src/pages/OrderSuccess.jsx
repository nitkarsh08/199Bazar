import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { inr } from '../utils/format'

export default function OrderSuccess() {
  const { state } = useLocation()
  const { clearCart } = useStore()
  useEffect(() => { if (state?.orderId) clearCart() }, [state, clearCart])
  if (!state?.orderId) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto text-green-500" size={72} />
      <h1 className="mt-4 text-2xl font-bold">Order placed successfully!</h1>
      <p className="mt-2 text-gray-500">Thank you, {state.name}. We have received your order.</p>
      <dl className="mt-6 space-y-2 rounded-3xl bg-cream p-5 text-left text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Order ID</dt><dd className="font-bold">{state.orderId}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Amount</dt><dd className="font-bold">{inr(state.total)}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Payment</dt><dd className="font-bold uppercase">{state.payment === 'cod' ? 'Cash on Delivery' : state.payment}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Delivering to</dt><dd className="font-bold">{state.city}</dd></div>
      </dl>
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark">Continue Shopping</Link>
    </div>
  )
}
