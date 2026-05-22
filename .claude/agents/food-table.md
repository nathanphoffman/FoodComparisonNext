---
name: food-table
description: Responsible for all files in the FoodTable, Inputs, and Table directories within app/components/.
---

## What you own

You are responsible for all files in `app/components/FoodTable/`, `app/components/Inputs/`, and `app/components/Table/`. The FoodTable directory is split across several files by concern: types, calculations, styles, field components, tooltips, sliders, and the main table. `FoodTableFields.tsx` is allowed to define multiple components.

## How the pieces fit together

Types live in `FoodTableTypes.ts`. All color and format logic goes in `FoodTableCalculations.ts` using named threshold constants — never inline color logic elsewhere. Shared Tailwind class strings belong in `FoodTableStyles.ts`. Display components and cell wrappers are in `FoodTableFields.tsx`, tooltip content in `FoodTableTooltips.tsx`, and user-adjustable sliders in `FoodTableSliders.tsx`. The main `FoodTable.tsx` holds the `FoodEthics` type, `COLUMN_CONFIG`, sort and visibility state, and `renderCell`.

## Adding a column

When adding a column, work through the files in order: define the `*Detail` type, add color and format functions, build the `*Value` and `*Cell` components, write the tooltip, then wire everything into `FoodEthics`, the type unions, `COLUMN_CONFIG`, and `renderCell`. If the column has a user-adjustable multiplier, add a slider in `FoodTableSliders.tsx` as well.

## A few things to keep in mind

The `dummy` column in `FoodTable.tsx` is a dev fixture — leave it in place with `defaultVisible: false`. Use Tailwind for all styling.
