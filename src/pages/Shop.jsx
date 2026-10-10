import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { categories, categoryBySlug } from '../data/categories'
import { products } from '../data/products'
import { discountPct } from '../utils/format'

const PER_PAGE = 12
const PRICES = [
  { id: 'u199', label: '₹199 & Below', min: 0, max: 199 },
  { id: '199-499', label: '₹199 - ₹499', min: 199, max: 499 },
  { id: '499-999', label: '₹499 - ₹999', min: 499, max: 999 },
  { id: '999+', label: '₹999 & Above', min: 999, max: Infinity },
]
const SORTS = [
  { id: '', label: 'Popular' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'discount', label: 'Biggest Discount' },
]

function Radio({ name, value, current, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1.5 text-sm">
      <input type="radio" name={name} checked={current === value} onChange={() => onChange(value)} className="accent-orange-500" />
      {children}
    </label>
  )
}

function Filters({ category, price, rating, set, clear, hasFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">Category</h3>
        <Radio name="cat" value="" current={category} onChange={(v) => set('category', v)}>All Products</Radio>
        {categories.map((c) => (
          <Radio key={c.slug} name="cat" value={c.slug} current={category} onChange={(v) => set('category', v)}>{c.emoji} {c.name}</Radio>
        ))}
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">Price</h3>
        <Radio name="price" value="" current={price} onChange={(v) => set('price', v)}>Any price</Radio>
        {PRICES.map((p) => <Radio key={p.id} name="price" value={p.id} current={price} onChange={(v) => set('price', v)}>{p.label}</Radio>)}
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">Customer Rating</h3>
        <Radio name="rating" value="" current={rating} onChange={(v) => set('rating', v)}>Any rating</Radio>
        <Radio name="rating" value="4" current={rating} onChange={(v) => set('rating', v)}>4★ & above</Radio>
        <Radio name="rating" value="3" current={rating} onChange={(v) => set('rating', v)}>3★ & above</Radio>
      </div>
      {hasFilters && <button type="button" onClick={clear} className="w-full rounded-xl border border-brand py-2 text-sm font-semibold text-brand-dark hover:bg-cream">Clear all filters</button>}
    </div>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [visible, setVisible] = useState(PER_PAGE)
  const [open, setOpen] = useState(false)

  const category = params.get('category') || ''
  const q = (params.get('q') || '').trim()
  const price = params.get('price') || ''
  const rating = params.get('rating') || ''
  const sort = params.get('sort') || ''
  const hasFilters = Boolean(category || price || rating || q)

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next)
    setVisible(PER_PAGE)
  }
  const clear = () => { setParams(sort ? { sort } : {}); setVisible(PER_PAGE) }

  const list = useMemo(() => {
    const range = PRICES.find((p) => p.id === price)
    const term = q.toLowerCase()
    const out = products.filter((p) => {
      if (category && p.category !== category) return false
      if (range && (p.price < range.min || p.price > range.max)) return false
      if (rating && p.rating < Number(rating)) return false
      if (term && !`${p.name} ${p.description} ${categoryBySlug(p.category)?.name}`.toLowerCase().includes(term)) return false
      return true
    })
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => discountPct(b) - discountPct(a),
    }[sort]
    return by ? [...out].sort(by) : [...out].sort((a, b) => b.reviews - a.reviews)
  }, [category, price, rating, q, sort])

  const heading = q ? `Results for "${q}"` : category ? categoryBySlug(category)?.name ?? 'Shop' : 'All Products'

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-gray-500"><Link to="/" className="hover:text-brand-dark">Home</Link> / <span className="text-navy">{heading}</span></nav>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{heading}</h1>
          <p className="text-sm text-gray-500">{list.length} {list.length === 1 ? 'product' : 'products'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium lg:hidden"><SlidersHorizontal size={16} /> Filters</button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-gray-500 sm:inline">Sort by</span>
            <select value={sort} onChange={(e) => set('sort', e.target.value)} className="rounded-full border bg-white px-3 py-2 text-sm outline-none focus:border-brand">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block"><Filters {...{ category, price, rating, set, clear, hasFilters }} /></aside>

        <section aria-label="Products">
          {list.length === 0 ? (
            <div className="rounded-3xl bg-cream px-6 py-16 text-center">
              <p className="text-5xl">🔍</p>
              <h2 className="mt-3 text-lg font-bold">No products found</h2>
              <p className="mt-1 text-sm text-gray-500">Try changing your filters or search term.</p>
              <button type="button" onClick={clear} className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
                {list.slice(0, visible).map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {visible < list.length && (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setVisible((v) => v + PER_PAGE)} className="rounded-full border-2 border-navy px-8 py-2.5 text-sm font-bold hover:bg-navy hover:text-white">Load more</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Filters</h2><button type="button" onClick={() => setOpen(false)} aria-label="Close filters"><X size={24} /></button></div>
            <Filters {...{ category, price, rating, set, clear, hasFilters }} />
            <button type="button" onClick={() => setOpen(false)} className="mt-5 w-full rounded-full bg-brand py-3 font-bold text-white">Show {list.length} products</button>
          </div>
        </div>
      )}
    </div>
  )
}
