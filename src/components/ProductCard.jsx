import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import ProductImage from './ProductImage'
import Rating from './Rating'
import { useStore } from '../context/StoreContext'
import { discountPct, inr } from '../utils/format'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const liked = wishlist.includes(product.id)
  const off = discountPct(product)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <ProductImage product={product} />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{off}% OFF</span>
        )}
        {product.tag === 'new' && (
          <span className="absolute bottom-2 left-2 rounded-full bg-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">New</span>
        )}
      </Link>
      <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110">
        <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <Link to={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug hover:text-brand-dark">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviews} />
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold">{inr(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">{inr(product.mrp)}</span>
        </div>
        <button type="button" onClick={() => addToCart(product.id)}
          className="flex items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-brand">
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </article>
  )
}
