import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-6xl">🛒</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-500">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-brand px-7 py-3 font-bold text-white hover:bg-brand-dark">Back to Home</Link>
    </div>
  )
}
