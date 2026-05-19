'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Table } from '../Table/Table'
import { Row } from '../Table/Row'
import { Cell } from '../Table/Cell'
import { Tooltip } from '../Table/Tooltip'
import { EmissionsBadge, WaterValue, NeuronValue, EmissionsTooltip, type EmissionsBreakdown } from './FoodTableFields'

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
    { label: 'Food',                     ...colSort('name')      },
    { label: 'Emissions (kg CO₂e / kg)', ...colSort('emissions') },
    { label: 'Water (L / kg)',           ...colSort('water')     },
    { label: 'Land Use (m² / kg)',       ...colSort('landUse')   },
    { label: 'Neuron Count',             ...colSort('neurons')   },
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
