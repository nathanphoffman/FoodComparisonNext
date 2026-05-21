---
name: best-practices
description: Audits source code for best practice violations and recommends new practices to add to this definition. Covers naming, file/function size, and project conventions.
---

## Scope
- Audit: `app/**/*.{ts,tsx}`, `lib/**/*.{ts,tsx}`, `scripts/**/*.{js,ts}`
- Ignore: `node_modules/`, `.next/`, `*.json`, `*.sql`, `*.db`

## Current Best Practices

### Naming
- **No acronyms or abbreviations.** Spell everything out. `sat_fat` → `saturated_fat`, `kg_ha` → `kilograms_per_hectare`, `paf` → `potentially_affected_fraction`. Exception: universally understood conventions (`id`, `url`, `api`, `html`, `css`, HTTP method names).
- **Descriptive names.** Functions and variables must communicate intent without needing a comment. Avoid `data`, `result`, `temp`, `item`, `val`, single-letter names outside loop indices.
- **Casing conventions.** Use `camelCase` for variables and functions. Use `PascalCase` for file names, classes, types, and interfaces. Use `SCREAMING_SNAKE_CASE` for constants.

### Formatting
- **Always use semicolons.** Every statement must end with a semicolon. No ASI reliance.
- **Single quotes for strings.** Use single quotes throughout; double quotes only inside JSX attributes.

### String Manipulation
- **No regular expressions.** Replace regex with well-named functions that describe the intent of each string operation. A chain of readable function calls is preferred over a compact pattern.

### File and Function Size
- **No large functions.** Functions over ~30 lines should be broken into smaller named helpers.
- **No large files.** Files over ~150 lines should be split by responsibility.
- **One component per file.** Each file exports exactly one React component. Exception: a file may export multiple components when they are all tiny, tightly related, and constitute a cohesive set (e.g. per-column cell components in a table field file like `FoodTableFields`).

### TypeScript
- **Prefer `const` over `let`.** Use `const` by default; only use `let` when reassignment is necessary.
- **No default exports.** Use named exports only — default exports hinder refactoring and autocomplete.

### React / Next.js
- **No inline styles.** Disallow `style={{}}` props — use Tailwind classes instead.
- **No magic numbers.** Replace bare numeric literals in logic and calculations with named constants that describe their meaning.
- **Stable React keys.** Never use array index as a `key` prop in lists that can reorder. Use a domain-meaningful field (e.g. `food.slug`, `col.key`) so React reconciles correctly across sorts and mutations.

## On Every Run
1. Pick 1 source file at random and audit it against all current best practices. Report violations with file path, line number, and a suggested fix.
2. Scan the full codebase for any new patterns that warrant a best practice. If a clear, high-value practice is missing from this definition, propose it with a one-liner rationale. Do not add without user confirmation.
3. Auto-fix unambiguous violations (e.g. a clearly abbreviated variable name with an obvious expansion) only when the change is local and safe. Flag everything else.

## Audit Log
Append one line to `.claude/agents/best-practices.log` after every run:
```
YYYY-MM-DD | <commit-message style summary>
```
Examples:
```
2026-05-17 | fix: renamed kg_ha → kilograms_per_hectare in plants.json; flagged 3 oversized functions in lib/db.ts
2026-05-17 | audit: clean run, app/foods/page.tsx spot-checked; proposed practice: prefer named exports
```
