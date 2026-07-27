// Unified embedder interface, shared between the browser (client search) and
// the Node precompute script. Uses a multilingual ONNX model via
// @huggingface/transformers so embeddings work in both environments without
// native bindings (replaces the old server-side OpenAIEmbeddings + HNSWLib).
export type Embedder = {
  dim: number;
  embed: (text: string) => Promise<number[]>;
  close: () => void;
};

export const EMBEDDING_MODEL_ID =
  "yuiseki/granite-embedding-97m-multilingual-r2-ONNX";
export const EMBEDDING_MODEL_DTYPE = "q8";

export const createTransformersEmbedder = async (): Promise<Embedder> => {
  const { pipeline } = await import("@huggingface/transformers");
  const extractor = await pipeline(
    "feature-extraction",
    EMBEDDING_MODEL_ID,
    { dtype: EMBEDDING_MODEL_DTYPE as never },
  );
  const run = async (text: string) => {
    const out = await extractor(text, { pooling: "cls", normalize: true });
    return Array.from(out.data as Float32Array).map((v) => Number(v));
  };
  const probe = await run("probe");
  return {
    dim: probe.length,
    embed: run,
    close: () => {
      void (extractor as { dispose?: () => void }).dispose?.();
    },
  };
};
