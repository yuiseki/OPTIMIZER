import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

const loader = new CSVLoader("public/supportsSummarized.csv");
const docs = await loader.load();

console.log(docs.length);

dotenv.config();

const vectorStoreSaveDir = "public/vector_store/summarized";

/*
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
await vectorStore.save(vectorStoreSaveDir);
*/

const loadedVectorStore = await HNSWLib.load(
  vectorStoreSaveDir,
  new OpenAIEmbeddings()
);

const result = await loadedVectorStore.similaritySearch(
  "災害で家が全壊した",
  4
);
console.log(result);

console.log("----- -----");
const result2 = await loadedVectorStore.similaritySearch(
  "コロナで仕事を失った",
  4
);
console.log(result2);
