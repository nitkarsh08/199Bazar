import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Wishlist() {
  const { wishlist } = useStore()
  const list = products.filter((p) => wishlist.includes(p.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <h1 className="mb-5 text-2xl font-bold">My Wishlist <span className="text-base font-medium text-gray-500">({list.length})</span></h1>
      {list.length === 0 ? (
        <div className="px-4 py-16 text-center">
          <p className="text-6xl">💛</p>
          <h2 className="mt-4 text-xl font-bold">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-500">Tap the heart on any product to save it for later.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-brand px-7 py-3 font-bold text-white hover:bg-brand-dark">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  )
}
