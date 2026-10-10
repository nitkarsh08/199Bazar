import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, Truck, Wallet } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { categories } from '../data/categories'
import { products } from '../data/products'

const slides = [
  { bg: 'from-orange-400 to-amber-300', dark: false, title: 'Sab Ke Liye, Sab Kuch', text: 'Fashion, electronics, home, beauty and more at prices you will love.', cta: 'Shop Now', to: '/shop', emojis: ['👕', '🎧', '🏠', '💄'] },
  { bg: 'from-slate-900 to-indigo-800', dark: true, title: '₹199 & Below Store', text: 'Pocket-friendly picks from every category. Great value, every day.', cta: 'Explore Deals', to: '/shop?price=u199', emojis: ['🖊️', '🧴', '🔌', '🪢'] },
  { bg: 'from-emerald-500 to-lime-400', dark: false, title: 'Fresh Groceries & Daily Needs', text: 'Stock up on everyday essentials, delivered to your door.', cta: 'Shop Groceries', to: '/shop?category=groceries', emojis: ['🥜', '🍵', '🫙', '🛒'] },
]

function HeroSlider() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])
  const s = slides[i]
  const go = (d) => setI((n) => (n + d + slides.length) % slides.length)

  return (
    <section aria-label="Offers" className="relative overflow-hidden rounded-3xl">
      <div key={i} className={`fade-in flex min-h-[260px] items-center bg-gradient-to-br ${s.bg} px-6 py-8 sm:min-h-[340px] sm:px-12 ${s.dark ? 'text-white' : 'text-navy'}`}>
        <div className="max-w-md">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{s.title}</h1>
          <p className="mt-3 text-sm opacity-90 sm:text-base">{s.text}</p>
          <Link to={s.to} className={`mt-6 inline-block rounded-full px-7 py-3 text-sm font-bold shadow transition hover:scale-105 ${s.dark ? 'bg-brand text-white' : 'bg-navy text-white'}`}>
            {s.cta}
          </Link>
        </div>
        <div className="ml-auto hidden grid-cols-2 gap-4 text-6xl md:grid lg:text-7xl" aria-hidden="true">
          {s.emojis.map((e) => <span key={e} className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/25 backdrop-blur lg:h-32 lg:w-32">{e}</span>)}
        </div>
      </div>
      <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white sm:block"><ChevronLeft size={20} /></button>
      <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white sm:block"><ChevronRight size={20} /></button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, n) => (
          <button key={n} type="button" onClick={() => setI(n)} aria-label={`Go to slide ${n + 1}`}
            className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} />
        ))}
      </div>
    </section>
  )
}

function Grid({ list }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const under199 = products.filter((p) => p.price <= 199).slice(0, 8)
  const bestsellers = products.filter((p) => p.tag === 'bestseller').slice(0, 8)
  const fresh = products.filter((p) => p.tag === 'new').slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-5 sm:py-8">
      <HeroSlider />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          [Truck, 'Free Delivery', 'On orders above ₹499'],
          [Wallet, 'Cash on Delivery', 'Pay when you receive'],
          [RotateCcw, 'Easy Returns', 'Simple return process'],
          [ShieldCheck, 'Secure Payments', 'Safe & trusted checkout'],
        ].map(([Icon, t, s]) => (
          <li key={t} className="flex items-center gap-3 rounded-2xl bg-cream p-3 sm:p-4">
            <Icon className="shrink-0 text-brand-dark" size={26} />
            <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-gray-500">{s}</p></div>
          </li>
        ))}
      </ul>

      <section>
        <SectionHeading title="Shop by Category" subtitle="Sab ke liye, sab kuch - find what you need" to="/shop" />
        <ul className="grid grid-cols-4 gap-3 sm:gap-5 lg:grid-cols-8">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?category=${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
                <span className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-sm transition group-hover:scale-110 group-hover:shadow-md sm:h-20 sm:w-20 sm:text-4xl ${c.dot}`}>{c.emoji}</span>
                <span className="text-[11px] font-medium leading-tight sm:text-xs">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading title="₹199 & Below" subtitle="Great picks that are easy on the pocket" to="/shop?price=u199" />
        <Grid list={under199} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/shop?category=electronics" className="group flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-400 p-6 text-white sm:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-widest opacity-80">Electronics</p><h3 className="mt-1 text-2xl font-extrabold">Gadgets for less</h3><span className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-indigo-700">Shop now</span></div>
          <span className="text-7xl transition group-hover:scale-110" aria-hidden="true">🎧</span>
        </Link>
        <Link to="/shop?category=fashion" className="group flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 to-orange-400 p-6 text-white sm:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-widest opacity-80">Fashion</p><h3 className="mt-1 text-2xl font-extrabold">Style for everyone</h3><span className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-rose-600">Explore</span></div>
          <span className="text-7xl transition group-hover:scale-110" aria-hidden="true">👗</span>
        </Link>
      </section>

      <section>
        <SectionHeading title="Best Sellers" subtitle="Most loved by our customers" to="/shop" />
        <Grid list={bestsellers} />
      </section>

      <section>
        <SectionHeading title="New Arrivals" subtitle="Fresh additions to the bazaar" to="/shop" />
        <Grid list={fresh} />
      </section>

      <section className="rounded-3xl bg-navy px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Better Choices, Brighter Days</h2>
        <p className="mt-2 text-sm text-gray-300">Subscribe to get deals and new arrivals in your inbox.</p>
        {done ? (
          <p className="mt-5 font-semibold text-brand">Thanks for subscribing! 🎉</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setDone(true) }} className="mx-auto mt-5 flex max-w-md overflow-hidden rounded-full bg-white p-1">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" aria-label="Email address" className="min-w-0 flex-1 px-4 text-sm text-navy outline-none" />
            <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">Subscribe</button>
          </form>
        )}
      </section>
    </div>
  )
}
