// The two program datasets OPTIMIZER searches against. Each maps to a
// precomputed parquet file (see scripts/precompute-embeddings.ts) shipped as
// a static asset and queried client-side via duckdb-wasm.
export type DatasetId = "digital-agency" | "taito";

export const DATASETS: { id: DatasetId; label: string }[] = [
  { id: "digital-agency", label: "デジタル庁の制度" },
  { id: "taito", label: "台東区の制度" },
];

export const parquetUrlFor = (id: DatasetId) => `/embeddings/${id}.parquet`;
