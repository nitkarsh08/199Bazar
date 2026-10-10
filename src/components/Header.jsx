import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import logo from '../assets/logo-wordmark.png'
import { categories } from '../data/categories'
import { useStore } from '../context/StoreContext'
import { FREE_DELIVERY_ABOVE } from '../utils/config'

function Badge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Header() {
  const { cartCount, wishlist } = useStore()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop')
    setOpen(false)
  }

  const search = (
    <form onSubmit={submit} role="search" className="flex w-full overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50 focus-within:border-brand">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for products, categories..."
        aria-label="Search products" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none" />
      <button type="submit" aria-label="Search" className="bg-brand px-4 text-white transition hover:bg-brand-dark">
        <Search size={18} />
      </button>
    </form>
  )

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-navy px-4 py-1.5 text-center text-xs font-medium text-white">
        🚚 Free delivery on orders above ₹{FREE_DELIVERY_ABOVE}<span className="hidden sm:inline"> &nbsp;|&nbsp; Cash on Delivery available</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6">
        <button type="button" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={24} /></button>
        <Link to="/" aria-label="199Bazar home" className="shrink-0">
          <img src={logo} alt="199Bazar" className="h-9 w-auto sm:h-11" />
        </Link>
        <div className="hidden flex-1 md:block md:max-w-2xl">{search}</div>

        <nav className="ml-auto flex items-center gap-4 sm:gap-6" aria-label="Account and cart">
          <Link to="/login" className="hidden flex-col items-center text-xs text-gray-600 hover:text-brand-dark sm:flex">
            <User size={22} /> Account
          </Link>
          <Link to="/wishlist" className="relative hidden flex-col items-center text-xs text-gray-600 hover:text-brand-dark sm:flex" aria-label="Wishlist">
            <Heart size={22} /> Wishlist <Badge count={wishlist.length} />
          </Link>
          <Link to="/cart" className="relative flex flex-col items-center text-xs text-gray-600 hover:text-brand-dark" aria-label="Cart">
            <ShoppingCart size={22} /> <span className="hidden sm:inline">Cart</span> <Badge count={cartCount} />
          </Link>
        </nav>
      </div>

      <div className="px-4 pb-3 md:hidden">{search}</div>

      <nav className="hidden border-t border-gray-100 md:block" aria-label="Categories">
        <ul className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 text-sm font-medium">
          <li><NavLink to="/shop" end className={({ isActive }) => `block whitespace-nowrap px-3 py-2.5 hover:text-brand-dark ${isActive ? 'text-brand-dark' : ''}`}>All Products</NavLink></li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?category=${c.slug}`} className="block whitespace-nowrap px-3 py-2.5 hover:text-brand-dark">{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <img src={logo} alt="199Bazar" className="h-9 w-auto" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <ul className="flex-1 overflow-y-auto p-2 text-sm font-medium">
              <li><Link onClick={() => setOpen(false)} to="/shop" className="block rounded-lg px-3 py-3 hover:bg-cream">🛍️ All Products</Link></li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link onClick={() => setOpen(false)} to={`/shop?category=${c.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${c.dot}`}>{c.emoji}</span> {c.name}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t pt-2"><Link onClick={() => setOpen(false)} to="/login" className="block rounded-lg px-3 py-3 hover:bg-cream">👤 Login / Sign up</Link></li>
            </ul>
          </aside>
        </div>
      )}
    </header>
  )
}
