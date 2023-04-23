import * as dotenv from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import fs from "node:fs/promises";

dotenv.config();

import { PromptTemplate } from "langchain/prompts";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const template = `以下の文章を簡潔にまとめてください。:

"{text}"

簡潔な要約:`;
const DEFAULT_PROMPT = /*#__PURE__*/ new PromptTemplate({
  template,
  inputVariables: ["text"],
});
const params: any = {
  prompt: DEFAULT_PROMPT,
  combineMapPrompt: DEFAULT_PROMPT,
  combinePrompt: DEFAULT_PROMPT,
  type: "map_reduce",
};
const SummarizationChainParamsJapanese = params;

// 元データ読み込み
const jsonFile = await fs.readFile(
  "public/data/Tokyo/Taito/vector_stores/base/docstore.json",
  "utf-8"
);
const jsonDocsList = JSON.parse(jsonFile);
console.info(jsonDocsList.length);

// 要約タスク準備
const model = new OpenAI({ temperature: 0, maxTokens: 1400 });
const chain = loadSummarizationChain(model, SummarizationChainParamsJapanese);

// 要約タスク実行
const resultDocs = [];

for await (const jsonDocs of jsonDocsList) {
  try {
    console.log("----- ----- -----");
    console.log(jsonDocs[1].metadata.source);
    console.log(jsonDocs[1].pageContent.length);
    const res = await chain.call({
      input_documents: [jsonDocs[1]],
    });
    const result = res.text;
    jsonDocs[1].pageContent = result;
    console.log(jsonDocs[1]);
    resultDocs.push(jsonDocs[1]);
    console.log("----- ----- -----");
  } catch (error) {
    console.error(error);
  }
}

console.log(resultDocs.length);

// 要約結果をVectorStoreに保存
const vectorStoreSaveDir = "public/data/Tokyo/Taito/vector_stores/summarized";
const vectorStore = await HNSWLib.fromDocuments(
  resultDocs,
  new OpenAIEmbeddings()
);
await vectorStore.save(vectorStoreSaveDir);
