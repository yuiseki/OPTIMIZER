// Re-embeds the program descriptions that used to live in the HNSWLib +
// OpenAIEmbeddings vector stores under public/data/**/vector_stores/summarized,
// and writes them out as parquet files under public/embeddings/. The browser
// loads these directly (via duckdb-wasm) instead of calling a server API, so
// there's no more server-side vector store / native binding / filesystem
// dependency at runtime.
//
// Usage: npm run precompute
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { DuckDBInstance } from "@duckdb/node-api";

import { createTransformersEmbedder } from "../src/lib/rag/embedder.ts";

const OUTPUT_DIR = join(process.cwd(), "public", "embeddings");

type SourceDoc = {
  pageContent: string;
  metadata: { source?: string; line?: number };
};

const DATASETS: { id: string; docstorePath: string }[] = [
  {
    id: "digital-agency",
    docstorePath: join(
      "public",
      "data",
      "DigitalAgency",
      "vector_stores",
      "summarized",
      "docstore.json",
    ),
  },
  {
    id: "taito",
    docstorePath: join(
      "public",
      "data",
      "Tokyo",
      "Taito",
      "vector_stores",
      "summarized",
      "docstore.json",
    ),
  },
];

const loadDocs = async (docstorePath: string): Promise<string[]> => {
  const raw = JSON.parse(await readFile(docstorePath, "utf8")) as [
    string,
    SourceDoc,
  ][];
  return raw.map(([, doc]) => doc.pageContent);
};

const writeParquet = async (
  outPath: string,
  rows: { id: number; content: string; vec: number[] }[],
  dim: number,
): Promise<void> => {
  const tmpJson = join(tmpdir(), `optimizer-precompute-${Date.now()}.json`);
  await writeFile(tmpJson, JSON.stringify(rows), "utf8");

  const instance = await DuckDBInstance.create();
  const conn = await instance.connect();
  try {
    await conn.run(
      `COPY (
         SELECT id, content, vec::FLOAT[${dim}] AS vec
         FROM read_json('${tmpJson}', format='array')
         ORDER BY id
       ) TO '${outPath}' (FORMAT parquet);`,
    );
  } finally {
    conn.closeSync();
    instance.closeSync();
    await rm(tmpJson, { force: true });
  }
};

const main = async () => {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const embedder = await createTransformersEmbedder();

  for (const dataset of DATASETS) {
    console.log(`\n=== ${dataset.id} ===`);
    const docs = await loadDocs(dataset.docstorePath);
    console.time(`embed ${dataset.id}`);
    const rows: { id: number; content: string; vec: number[] }[] = [];
    for (let i = 0; i < docs.length; i++) {
      const vec = await embedder.embed(docs[i]);
      rows.push({ id: i, content: docs[i], vec });
    }
    console.timeEnd(`embed ${dataset.id}`);

    const outPath = join(OUTPUT_DIR, `${dataset.id}.parquet`);
    await writeParquet(outPath, rows, embedder.dim);
    console.log(`-> ${outPath} (dim=${embedder.dim}, rows=${rows.length})`);
  }

  embedder.close();
  console.log("\n完了: 事前計算した parquet を public/embeddings/ に出力しました");
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
