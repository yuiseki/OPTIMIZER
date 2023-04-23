import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

dotenv.config();

const vectorStoreSaveDirBase = "public/data/Tokyo/Taito/vector_stores/base";
const loadedVectorStoreBase = await HNSWLib.load(
  vectorStoreSaveDirBase,
  new OpenAIEmbeddings()
);
const resultBase = await loadedVectorStoreBase.similaritySearch(
  "子育てで悩んでいる",
  4
);
console.log(resultBase);

console.log("----- ----- ----- -----");

const vectorStoreSaveDirSummarized =
  "public/data/Tokyo/Taito/vector_stores/summarized";
const loadedVectorStoreSummarized = await HNSWLib.load(
  vectorStoreSaveDirSummarized,
  new OpenAIEmbeddings()
);
const resultSummarized = await loadedVectorStoreSummarized.similaritySearch(
  "子育てで悩んでいる",
  4
);
console.log(resultSummarized);
