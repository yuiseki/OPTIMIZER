import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

dotenv.config();

const vectorStoreSaveDir = "public/data/Tokyo/Taito/vector_stores/base";

const loadedVectorStore = await HNSWLib.load(
  vectorStoreSaveDir,
  new OpenAIEmbeddings()
);

const result = await loadedVectorStore.similaritySearch(
  "子育てで悩んでいる",
  4
);
console.log(result);
