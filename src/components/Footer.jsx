import { Link } from 'react-router-dom'
import { RotateCcw, ShieldCheck, Truck, Headphones } from 'lucide-react'
import logo from '../assets/logo-full.png'
import { categories } from '../data/categories'

const perks = [
  { icon: Truck, title: 'Fast Delivery', text: 'Quick shipping across India' },
  { icon: RotateCcw, title: 'Easy Returns', text: 'Hassle-free return policy' },
  { icon: ShieldCheck, title: 'Secure Payments', text: 'UPI, cards & Cash on Delivery' },
  { icon: Headphones, title: 'Customer Support', text: 'We are here to help' },
]

export default function Footer() {
  return (
    <footer className="mt-12 bg-navy text-gray-300">
      <div className="border-b border-white/10">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><Icon size={22} /></span>
              <div><p className="text-sm font-semibold text-white">{title}</p><p className="text-xs text-gray-400">{text}</p></div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3"><img src={logo} alt="199Bazar" className="h-16 w-auto" /></div>
          <p className="mt-4 text-sm font-medium text-white">Sab Ke Liye, Sab Kuch</p>
          <p className="mt-1 text-sm text-gray-400">Better Choices, Brighter Days.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link className="hover:text-brand" to={`/shop?category=${c.slug}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-brand" to="/login">Login / Sign up</Link></li>
            <li><Link className="hover:text-brand" to="/cart">My Cart</Link></li>
            <li><Link className="hover:text-brand" to="/wishlist">Wishlist</Link></li>
            <li><Link className="hover:text-brand" to="/shop">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">We Accept</h3>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {['UPI', 'Cards', 'Net Banking', 'Cash on Delivery'].map((m) => (
              <span key={m} className="rounded-md bg-white/10 px-3 py-1.5">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} 199Bazar. All rights reserved.  
        <h1>Developed By AW Solution</h1>
      </div>
    </footer>
  )
}
