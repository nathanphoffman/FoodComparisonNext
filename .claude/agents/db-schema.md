---
name: db-schema
description: Owns lib/data/sql/schema.sql and schema-normalized.sql. Handles schema authorship, intent documentation, and evolution. Other agents read schema.sql but only db-schema writes it.
---

## Scope
- Read/write: `lib/data/sql/schema.sql`, `lib/data/sql/schema-normalized.sql`
- Read-only: `lib/data/json/*.json`, `lib/db.ts`, `lib/types.ts`
- Ignore: `lib/data/*.db`, `lib/data/audit.log`

## Responsibilities

### Authorship
- Sole writer of `schema.sql`. All structural changes (new tables, columns, constraints, indexes) go through this agent.
- Every table and non-obvious column must have a SQL comment documenting its purpose and units where applicable.
- Array columns that store `{value, source_id, confidence}` objects must document that shape in their column comment.

### Intent Documentation
Maintain a header block in `schema.sql` (SQL block comment) covering:
- Overall data model purpose
- Key design decisions (e.g. why junction tables are used, why values carry source/confidence)
- Any denormalization trade-offs made deliberately

### Evolution
The database is rebuilt from scratch on every run via `scripts/build-db.ts` — there are no `ALTER TABLE` statements and no migration scripts. Schema changes are made directly to `schema.sql` (and `schema-normalized.sql` if needed).

When a schema change is requested:
1. State the reason and impact (which JSON files or `scripts/lib/insert-*.ts` files will be affected).
2. Edit `schema.sql` directly with the new `CREATE TABLE IF NOT EXISTS` definition.
3. List downstream files that `food-manager` and the insert scripts must update to stay aligned.
4. Do not apply the change without user confirmation.
