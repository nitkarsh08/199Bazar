import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from 'lucide-react'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import Rating from '../components/Rating'
import SectionHeading from '../components/SectionHeading'
import NotFound from './NotFound'
import { categoryBySlug } from '../data/categories'
import { products } from '../data/products'
import { useStore } from '../context/StoreContext'
import { MAX_QTY } from '../utils/config'
import { discountPct, inr } from '../utils/format'

export default function Product() {
  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')

  if (!product) return <NotFound />

  const cat = categoryBySlug(product.category)
  const liked = wishlist.includes(product.id)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const tabs = { description: 'Description', details: 'Details', shipping: 'Shipping & Returns' }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-gray-500">
        <Link to="/" className="hover:text-brand-dark">Home</Link> / <Link to={`/shop?category=${product.category}`} className="hover:text-brand-dark">{cat?.name}</Link> / <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="group relative aspect-square overflow-hidden rounded-3xl border border-gray-100">
          <ProductImage product={product} emojiSize="text-[9rem] sm:text-[11rem]" />
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-bold text-white">{discountPct(product)}% OFF</span>
        </div>

        <div>
          <p className="text-sm font-medium text-brand-dark">{cat?.name}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} count={product.reviews} size={16} /></div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold">{inr(product.price)}</span>
            <span className="text-lg text-gray-400 line-through">{inr(product.mrp)}</span>
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-sm font-semibold text-green-700">You save {inr(product.mrp - product.price)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

          <ul className="mt-5 space-y-1.5 text-sm text-gray-700">
            {product.highlights.map((h) => <li key={h} className="flex gap-2"><span className="text-green-600">✓</span>{h}</li>)}
          </ul>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center overflow-hidden rounded-full border">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-gray-100"><Minus size={16} /></button>
              <span className="w-10 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="p-2.5 hover:bg-gray-100"><Plus size={16} /></button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => addToCart(product.id, qty)} className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 font-bold text-white transition hover:bg-brand">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button type="button" onClick={() => { addToCart(product.id, qty, true); navigate('/checkout') }} className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-white transition hover:bg-brand-dark">
              <Zap size={18} /> Buy Now
            </button>
            <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'} className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 hover:border-red-300">
              <Heart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
            </button>
          </div>

          <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            {[[Truck, 'Fast Delivery'], [RotateCcw, 'Easy Returns'], [ShieldCheck, 'Secure Payment']].map(([Icon, t]) => (
              <li key={t} className="rounded-2xl bg-cream px-2 py-3"><Icon className="mx-auto mb-1 text-brand-dark" size={22} />{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-10">
        <div role="tablist" className="flex gap-6 border-b">
          {Object.entries(tabs).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} type="button" onClick={() => setTab(id)}
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${tab === id ? 'border-brand text-brand-dark' : 'border-transparent text-gray-500'}`}>{label}</button>
          ))}
        </div>
        <div role="tabpanel" className="max-w-3xl py-5 text-sm leading-relaxed text-gray-700">
          {tab === 'description' && <p>{product.description}</p>}
          {tab === 'details' && (
            <dl className="grid grid-cols-[140px_1fr] gap-y-2">
              <dt className="text-gray-500">Category</dt><dd>{cat?.name}</dd>
              {product.highlights.map((h, i) => (<><dt key={`k${i}`} className="text-gray-500">Feature {i + 1}</dt><dd key={`v${i}`}>{h}</dd></>))}
            </dl>
          )}
          {tab === 'shipping' && <p>Orders are usually delivered within 3-5 business days. Free delivery on eligible orders. If you are not happy with your purchase, you can request a return as per our return policy.</p>}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <SectionHeading title="You may also like" to={`/shop?category=${product.category}`} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  )
}
