'use client';

import { useState } from "react";
import { Slider } from "../Inputs/Slider";
import type { FoodWeights } from "./FoodTableTypes";

export type { FoodWeights };

const KEYS: (keyof FoodWeights)[] = ['calories', 'protein', 'mass'];

const LABELS: Record<keyof FoodWeights, string> = {
    calories: 'Calorie Weight',
    protein:  'Protein Weight',
    mass:     'Mass Weight',
};

const DEFAULT: FoodWeights = { calories: 34, protein: 33, mass: 33 };

export function FoodTableSliders({ onChange, onGreenWaterChange, onGreyWaterChange }: { onChange?: (w: FoodWeights) => void; onGreenWaterChange?: (w: number) => void; onGreyWaterChange?: (w: number) => void }) {

    const [ weights, setWeights ]           = useState<FoodWeights>(DEFAULT);
    const [ greenWaterWeight, setGreenWater ] = useState(100);
    const [ greyWaterWeight, setGreyWater ]   = useState(100);

    const handleChange = (key: keyof FoodWeights, newVal: number) => {
        setWeights(prev => {
            const others = KEYS.filter(k => k !== key);
            const otherTotal = others.reduce((s, k) => s + prev[k], 0);
            const delta = newVal - prev[key];

            const next = { ...prev, [key]: newVal } as FoodWeights;

            if (otherTotal === 0) {
                const half = Math.round((100 - newVal) / 2);
                next[others[0]] = half;
                next[others[1]] = 100 - newVal - half;
            } else {
                for (const k of others) {
                    next[k] = Math.max(0, Math.round(prev[k] - delta * (prev[k] / otherTotal)));
                }
                const drift = KEYS.reduce((s, k) => s + next[k], 0) - 100;
                if (drift !== 0) {
                    const largest = others.reduce((a, b) => next[a] >= next[b] ? a : b);
                    next[largest] = Math.max(0, next[largest] - drift);
                }
            }

            onChange?.(next);
            return next;
        });
    };

    const handleGreenWater = (val: number) => {
        setGreenWater(val);
        onGreenWaterChange?.(val);
    };

    const handleGreyWater = (val: number) => {
        setGreyWater(val);
        onGreyWaterChange?.(val);
    };

    return <div className="flex gap-6 mb-4">
        {KEYS.map(key => (
            <div key={key} className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between text-xs text-neutral-500">
                    <span>{LABELS[key]}</span>
                    <span className="font-medium text-neutral-700">{weights[key]}%</span>
                </div>
                <Slider min={0} max={100} value={weights[key]} onChange={v => handleChange(key, v)} />
            </div>
        ))}
        <div className="flex flex-col gap-1 flex-1 border-l border-neutral-200 pl-6">
            <div className="flex justify-between text-xs text-neutral-500">
                <span>Rain Water</span>
                <span className="font-medium text-neutral-700">{greenWaterWeight}%</span>
            </div>
            <Slider min={0} max={100} value={greenWaterWeight} onChange={handleGreenWater} />
            <div className="text-xs text-neutral-400 mt-0.5">how much green (rain) water counts</div>
        </div>
        <div className="flex flex-col gap-1 flex-1">
            <div className="flex justify-between text-xs text-neutral-500">
                <span>Pollution Water</span>
                <span className="font-medium text-neutral-700">{greyWaterWeight}%</span>
            </div>
            <Slider min={0} max={100} value={greyWaterWeight} onChange={handleGreyWater} />
            <div className="text-xs text-neutral-400 mt-0.5">how much grey (pollution) water counts</div>
        </div>
    </div>
}
