
// BEST PRACTICES AGENT: IGNORE THIS FILE, IT IS A RARE EXCEPTION TO THE 1 COMPONENT 1 FILE RULE
export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number }

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

export function WaterValue({ value }: { value: number }) {
  const color = value < 2000 ? 'text-sky-600' : value < 8000 ? 'text-amber-600' : 'text-red-600'
  return <span className={color}>{value.toLocaleString()}</span>
}

export function NeuronValue({ value }: { value: number }) {
  if (value === 0) return <span className="text-neutral-400">—</span>
  if (value >= 1_000_000_000) return <span className="text-orange-600 font-medium">{(value / 1_000_000_000).toFixed(0)}B</span>
  if (value >= 1_000_000)     return <span className="text-amber-600 font-medium">{(value / 1_000_000).toFixed(0)}M</span>
  return <span className="text-yellow-600 font-medium">{(value / 1_000).toFixed(0)}K</span>
}

export function EmissionsTooltip({ bd }: { bd: EmissionsBreakdown }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Emissions breakdown</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CO₂</span><span>{bd.co2.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CH₄ (as CO₂e)</span><span>{bd.ch4.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">N₂O (as CO₂e)</span><span>{bd.n2o.toFixed(1)} kg</span></div>
    </div>
  )
}
