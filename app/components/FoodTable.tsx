'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Table } from './Table'
import { Row } from './Row'
import { Cell } from './Cell'
import { Tooltip } from './Tooltip'

type EmissionsBreakdown = { co2: number; ch4: number; n2o: number }

export type FoodEthics = {
  name: string
  slug: string
  emissions: number
  water: number
  landUse: number
  neurons: number
  emissionsBreakdown?: EmissionsBreakdown
}

const mockFoods: FoodEthics[] = [
  { name: 'Beef',     slug: 'beef',     emissions: 27.0, water: 15415, landUse: 164,  neurons: 71_000_000_000, emissionsBreakdown: { co2: 3.0, ch4: 20.0, n2o: 4.0 } },
  { name: 'Pork',     slug: 'pork',     emissions: 12.1, water: 5988,  landUse: 11,   neurons: 1_000_000_000,  emissionsBreakdown: { co2: 3.0, ch4: 5.0,  n2o: 4.1 } },
  { name: 'Chicken',  slug: 'chicken',  emissions: 6.9,  water: 4325,  landUse: 7.1,  neurons: 221_000_000,    emissionsBreakdown: { co2: 2.8, ch4: 1.9,  n2o: 2.2 } },
  { name: 'Salmon',   slug: 'salmon',   emissions: 11.9, water: 2000,  landUse: 0,    neurons: 10_000_000,     emissionsBreakdown: { co2: 9.5, ch4: 1.2,  n2o: 1.2 } },
  { name: 'Eggs',     slug: 'eggs',     emissions: 4.8,  water: 3265,  landUse: 5.7,  neurons: 221_000_000,    emissionsBreakdown: { co2: 1.8, ch4: 1.5,  n2o: 1.5 } },
  { name: 'Milk',     slug: 'milk',     emissions: 3.2,  water: 628,   landUse: 8.9,  neurons: 71_000_000_000, emissionsBreakdown: { co2: 0.4, ch4: 2.1,  n2o: 0.7 } },
  { name: 'Tofu',     slug: 'tofu',     emissions: 3.0,  water: 2145,  landUse: 2.2,  neurons: 0,              emissionsBreakdown: { co2: 2.2, ch4: 0.4,  n2o: 0.4 } },
  { name: 'Lentils',  slug: 'lentils',  emissions: 0.9,  water: 1250,  landUse: 3.4,  neurons: 0,              emissionsBreakdown: { co2: 0.3, ch4: 0.1,  n2o: 0.5 } },
  { name: 'Rice',     slug: 'rice',     emissions: 2.7,  water: 1670,  landUse: 2.8,  neurons: 0,              emissionsBreakdown: { co2: 0.5, ch4: 1.9,  n2o: 0.3 } },
  { name: 'Almonds',  slug: 'almonds',  emissions: 3.5,  water: 16095, landUse: 12,   neurons: 0,              emissionsBreakdown: { co2: 2.8, ch4: 0.2,  n2o: 0.5 } },
  { name: 'Broccoli', slug: 'broccoli', emissions: 0.4,  water: 285,   landUse: 0.4,  neurons: 0,              emissionsBreakdown: { co2: 0.2, ch4: 0.0,  n2o: 0.2 } },
  { name: 'Potatoes', slug: 'potatoes', emissions: 0.5,  water: 290,   landUse: 0.9,  neurons: 0,              emissionsBreakdown: { co2: 0.3, ch4: 0.0,  n2o: 0.2 } },
]

type SortKey = 'name' | 'emissions' | 'water' | 'landUse' | 'neurons'

function EmissionsBadge({ value }: { value: number }) {
  const color = value < 2 ? 'bg-green-100 text-green-700'
    : value < 10 ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-700'
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>{value.toFixed(1)}</span>
}

function WaterValue({ value }: { value: number }) {
  const color = value < 2000 ? 'text-sky-600' : value < 8000 ? 'text-amber-600' : 'text-red-600'
  return <span className={color}>{value.toLocaleString()}</span>
}

function NeuronValue({ value }: { value: number }) {
  if (value === 0) return <span className="text-neutral-400">—</span>
  if (value >= 1_000_000_000) return <span className="text-orange-600 font-medium">{(value / 1_000_000_000).toFixed(0)}B</span>
  if (value >= 1_000_000)     return <span className="text-amber-600 font-medium">{(value / 1_000_000).toFixed(0)}M</span>
  return <span className="text-yellow-600 font-medium">{(value / 1_000).toFixed(0)}K</span>
}

function EmissionsTooltip({ bd }: { bd: EmissionsBreakdown }) {
  return (
    <div className="space-y-1">
      <div className="font-semibold text-neutral-300 mb-1.5">Emissions breakdown</div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CO₂</span><span>{bd.co2.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">CH₄ (as CO₂e)</span><span>{bd.ch4.toFixed(1)} kg</span></div>
      <div className="flex justify-between gap-6"><span className="text-neutral-400">N₂O (as CO₂e)</span><span>{bd.n2o.toFixed(1)} kg</span></div>
    </div>
  )
}

export function FoodTable({ data = mockFoods }: { data?: FoodEthics[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function colSort(key: SortKey) {
    return { sorted: sortKey === key ? sortDir : undefined, onSort: () => handleSort(key) }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        if (av === bv) return 0
        const cmp = av < bv ? -1 : 1
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  const headers = [
    { label: 'Food',                      ...colSort('name')      },
    { label: 'Emissions (kg CO₂e / kg)',  align: 'right' as const, ...colSort('emissions') },
    { label: 'Water (L / kg)',            align: 'right' as const, ...colSort('water')     },
    { label: 'Land Use (m² / kg)',        align: 'right' as const, ...colSort('landUse')   },
    { label: 'Neuron Count',              align: 'right' as const, ...colSort('neurons')   },
  ]

  return (
    <Table headers={headers}>
      {sorted.map((food, i) => (
        <Row key={i}>
          <Cell>
            <Link href={`/foods/${food.slug}`} className="font-medium text-neutral-900 hover:text-blue-600 transition-colors">
              {food.name}
            </Link>
          </Cell>
          <Cell align="right">
            {food.emissionsBreakdown
              ? <Tooltip content={<EmissionsTooltip bd={food.emissionsBreakdown} />}><EmissionsBadge value={food.emissions} /></Tooltip>
              : <EmissionsBadge value={food.emissions} />
            }
          </Cell>
          <Cell align="right"><WaterValue value={food.water} /></Cell>
          <Cell align="right">
            {food.landUse === 0
              ? <span className="text-neutral-400">—</span>
              : <span>{food.landUse.toFixed(1)}</span>
            }
          </Cell>
          <Cell align="right"><NeuronValue value={food.neurons} /></Cell>
        </Row>
      ))}
    </Table>
  )
}
