import { categoryBySlug } from '../data/categories'

// Shows the real photo when `product.image` exists, otherwise a clean emoji tile.
export default function ProductImage({ product, className = '', emojiSize = 'text-6xl sm:text-7xl' }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className={`h-full w-full object-cover ${className}`} />
  }
  const cat = categoryBySlug(product.category)
  return (
    <div role="img" aria-label={product.name}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat?.grad ?? 'from-gray-100 to-gray-200'} ${className}`}>
      <span className={`${emojiSize} drop-shadow-sm transition-transform duration-300 group-hover:scale-110`}>{product.emoji}</span>
    </div>
  )
}
