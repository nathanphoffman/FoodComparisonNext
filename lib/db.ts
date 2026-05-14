import { readFileSync } from 'fs';
import { resolve } from 'path';
import initSqlJs from 'sql.js';

type SqlDatabase = Awaited<ReturnType<typeof initSqlJs>>['Database']['prototype'];

let db: SqlDatabase | null = null;

export async function getDb(): Promise<SqlDatabase> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file: string) =>
      resolve(process.cwd(), 'node_modules/sql.js/dist', file),
  });

  const dbPath = resolve(process.cwd(), 'lib/data/foods.db');
  const fileBuffer = readFileSync(dbPath);
  db = new SQL.Database(fileBuffer);
  return db;
}

export function rowsToObjects(
  result: ReturnType<SqlDatabase['exec']>
): Record<string, unknown>[] {
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}
