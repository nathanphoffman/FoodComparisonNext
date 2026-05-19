export type EmissionsBreakdown = { co2: number; ch4: number; n2o: number }

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
