import * as dotenv from "dotenv";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";

dotenv.config();

const loader = new CSVLoader("public/supports.csv");
const docs = await loader.load();

console.log(docs.length);

const slicedDocs = docs.slice(0, 5);

const model = new OpenAI({ temperature: 0 });
const chain = loadSummarizationChain(model);

for await (const doc of slicedDocs) {
  console.log("----- ----- -----");
  console.log("original:", doc.pageContent);
  const res = await chain.call({
    input_documents: [doc],
  });
  console.log("\n");
  console.log("generated summary:", res.text);
  console.log("----- ----- -----");
}
