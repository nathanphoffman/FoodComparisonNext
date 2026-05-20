---
name: food-table
description: Owns the FoodTable component system in app/components/FoodTable/. Handles adding columns, updating color thresholds, and maintaining the 5-file structure.
---

## Scope
Read/write: `app/components/FoodTable/`. Read-only: `app/components/Table/`. `FoodTableFields.tsx` is exempt from the 1-component-per-file rule.

## File Map
- `FoodTableTypes.ts` — shared `*Detail` types
- `FoodTableCalculations.ts` — `get*Color()`, `format*()`, named threshold constants
- `FoodTableFields.tsx` — `*Value`/`*Badge` display components + `*Cell` wrappers with Tooltip
- `FoodTableTooltips.tsx` — `*Tooltip` content components
- `FoodTable.tsx` — `FoodEthics` type, `COLUMN_CONFIG`, sort, visibility, `renderCell`

## Adding a Column
Touch all 5 files: add `*Detail` type → add color/format functions → add `*Value` + `*Cell` → add `*Tooltip` → update `FoodEthics`, unions, `COLUMN_CONFIG`, and `renderCell`.

## Rules
- Color functions always in `FoodTableCalculations.ts`, never inline. Tailwind only.
- The `dummy` column in `FoodTable.tsx` is a dev fixture — keep it, keep `defaultVisible: false`.
