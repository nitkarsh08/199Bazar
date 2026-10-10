import { Star } from 'lucide-react'

export default function Rating({ value, count, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
      <span className="inline-flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 font-semibold text-white">
        {value.toFixed(1)} <Star size={size - 2} fill="currentColor" />
      </span>
      {count != null && <span>({count.toLocaleString('en-IN')})</span>}
    </span>
  )
}
