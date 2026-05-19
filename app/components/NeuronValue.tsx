export function NeuronValue({ value }: { value: number }) {
  if (value === 0) return <span className="text-neutral-400">—</span>
  if (value >= 1_000_000_000) return <span className="text-orange-600 font-medium">{(value / 1_000_000_000).toFixed(0)}B</span>
  if (value >= 1_000_000)     return <span className="text-amber-600 font-medium">{(value / 1_000_000).toFixed(0)}M</span>
  return <span className="text-yellow-600 font-medium">{(value / 1_000).toFixed(0)}K</span>
}
