import { NavLink } from 'react-router-dom'
import { Heart, Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function MobileNav() {
  const { cartCount } = useStore()
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/shop', label: 'Shop', icon: LayoutGrid },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, count: cartCount },
    { to: '/login', label: 'Account', icon: User },
  ]
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end, count }) => (
          <li key={to}>
            <NavLink to={to} end={end}
              className={({ isActive }) => `relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${isActive ? 'text-brand-dark' : 'text-gray-500'}`}>
              <span className="relative">
                <Icon size={21} />
                {count > 0 && <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{count}</span>}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
