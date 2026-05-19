export function EmissionsBadge({ value }: { value: number }) {
  const color = value < 2 ? 'bg-green-100 text-green-700'
    : value < 10 ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {value.toFixed(1)}
    </span>
  )
}
