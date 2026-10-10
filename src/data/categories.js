// Tailwind classes are written in full so they are not purged.
export const categories = [
  { slug: 'fashion', name: 'Fashion', emoji: '👕', grad: 'from-rose-100 to-rose-200', dot: 'bg-rose-100' },
  { slug: 'electronics', name: 'Electronics', emoji: '📱', grad: 'from-indigo-100 to-indigo-200', dot: 'bg-indigo-100' },
  { slug: 'home-living', name: 'Home & Living', emoji: '🏠', grad: 'from-emerald-100 to-emerald-200', dot: 'bg-emerald-100' },
  { slug: 'beauty', name: 'Beauty & Personal Care', emoji: '💄', grad: 'from-pink-100 to-pink-200', dot: 'bg-pink-100' },
  { slug: 'toys-games', name: 'Toys & Games', emoji: '🧸', grad: 'from-amber-100 to-amber-200', dot: 'bg-amber-100' },
  { slug: 'books-stationery', name: 'Books & Stationery', emoji: '📚', grad: 'from-sky-100 to-sky-200', dot: 'bg-sky-100' },
  { slug: 'sports-fitness', name: 'Sports & Fitness', emoji: '🏋️', grad: 'from-teal-100 to-teal-200', dot: 'bg-teal-100' },
  { slug: 'groceries', name: 'Groceries & Daily Needs', emoji: '🛒', grad: 'from-red-100 to-orange-200', dot: 'bg-red-100' },
]
export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug)
