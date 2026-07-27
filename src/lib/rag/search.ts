// Client-side (browser) replacement for the old server-side HNSWLib vector
// search. Loads the precomputed parquet files (content + embedding already
// baked in by scripts/precompute-embeddings.ts) into an in-browser DuckDB via
// duckdb-wasm, builds an HNSW index via the VSS extension, and runs vector
// similarity search entirely client-side. No server, no native bindings, no
// filesystem access needed.
"use client";

import * as duckdb from "@duckdb/duckdb-wasm";
import { DATASETS, parquetUrlFor, type DatasetId } from "./datasets";

export type SearchResult = { content: string; distance: number };

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

const initDb = async (): Promise<duckdb.AsyncDuckDB> => {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);
  const worker = await duckdb.createWorker(bundle.mainWorker as string);
  const logger = new duckdb.VoidLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  const conn = await db.connect();
  try {
    await conn.query("INSTALL vss;");
    await conn.query("LOAD vss;");
    await conn.query("SET hnsw_enable_experimental_persistence = true;");

    for (const dataset of DATASETS) {
      const url = parquetUrlFor(dataset.id);
      const fileName = `${dataset.id}.parquet`;
      await db.registerFileURL(
        fileName,
        new URL(url, window.location.origin).toString(),
        duckdb.DuckDBDataProtocol.HTTP,
        false,
      );
      // Parquet has no fixed-size array type, so `vec` round-trips as a
      // variable-length LIST; the VSS HNSW index requires a genuine
      // FLOAT[N] (fixed-size ARRAY) column, hence the explicit cast here.
      const dimResult = await conn.query(
        `SELECT array_length(vec) AS dim FROM read_parquet('${fileName}') LIMIT 1;`,
      );
      const dim = Number(dimResult.toArray()[0]?.dim ?? 0);
      if (!dim) {
        throw new Error(`${dataset.id}: failed to determine embedding dim`);
      }
      await conn.query(
        `CREATE TABLE "${tableName(dataset.id)}" AS
         SELECT id, content, vec::FLOAT[${dim}] AS vec
         FROM read_parquet('${fileName}');`,
      );
      await conn.query(
        `CREATE INDEX "${tableName(dataset.id)}_hnsw" ON "${tableName(dataset.id)}" USING HNSW (vec);`,
      );
    }
  } finally {
    await conn.close();
  }

  return db;
};

const tableName = (id: DatasetId) => `docs_${id.replace(/-/g, "_")}`;

export const getDb = (): Promise<duckdb.AsyncDuckDB> => {
  if (!dbPromise) {
    dbPromise = initDb();
  }
  return dbPromise;
};

export const searchDataset = async (
  datasetId: DatasetId,
  queryVec: number[],
  limit = 10,
): Promise<SearchResult[]> => {
  const db = await getDb();
  const conn = await db.connect();
  try {
    const sql = `
      SELECT content, array_distance(vec, [${queryVec.join(",")}]::FLOAT[${queryVec.length}]) AS distance
      FROM "${tableName(datasetId)}"
      ORDER BY distance ASC
      LIMIT ${limit};
    `;
    const result = await conn.query(sql);
    // Read typed fields off the Arrow row proxy directly rather than
    // stringifying (program text can contain newlines/control characters,
    // which broke naive JSON.parse(String(row))).
    return result.toArray().map((row) => ({
      content: String(row.content),
      distance: Number(row.distance),
    }));
  } finally {
    await conn.close();
  }
};
