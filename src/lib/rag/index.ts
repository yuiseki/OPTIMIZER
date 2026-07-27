"use client";

import { createTransformersEmbedder, type Embedder } from "./embedder";
import { searchDataset } from "./search";

export type RagResult = {
  programs: string;
  areaPrograms: string;
};

let embedderPromise: Promise<Embedder> | null = null;
const getEmbedder = (): Promise<Embedder> => {
  if (!embedderPromise) {
    embedderPromise = createTransformersEmbedder();
  }
  return embedderPromise;
};

const formatPrograms = (contents: string[]) =>
  contents.map((content) => `- ${content}`).join("\n");

// Retrieval step of the old server-side RAG flow (used to be
// api/completion.ts loading two HNSWLib vector stores from disk). Now runs
// entirely in the browser: embed the query with the same model used to
// precompute the program embeddings, then vector-search both datasets via
// DuckDB-wasm.
export const runRetrieval = async (query: string): Promise<RagResult> => {
  const embedder = await getEmbedder();
  const queryVec = await embedder.embed(query);

  const [digitalAgencyResults, areaResults] = await Promise.all([
    searchDataset("digital-agency", queryVec, 3),
    searchDataset("taito", queryVec, 3),
  ]);

  return {
    programs: formatPrograms(digitalAgencyResults.map((r) => r.content)),
    areaPrograms: formatPrograms(areaResults.map((r) => r.content)),
  };
};
