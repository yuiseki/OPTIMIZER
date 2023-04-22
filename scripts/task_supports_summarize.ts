import * as dotenv from "dotenv";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { PromptTemplate } from "langchain";
import * as fs from "fs";

dotenv.config();

const loader = new CSVLoader("public/supports.csv");
const docs = await loader.load();
console.log(docs.length);

const model = new OpenAI({ temperature: 0, maxTokens: 1000 });

const template = `以下の文章を簡潔にまとめてください。:

"{text}"

簡潔な要約:`;

export const DEFAULT_PROMPT = /*#__PURE__*/ new PromptTemplate({
  template,
  inputVariables: ["text"],
});
const params: any = {
  prompt: DEFAULT_PROMPT,
  combineMapPrompt: DEFAULT_PROMPT,
  combinePrompt: DEFAULT_PROMPT,
  type: "map_reduce",
};
const chain = loadSummarizationChain(model, params);

const results: { id: string; generatedSummary: string }[] = [];

// 要約タスク実行
for await (const doc of docs) {
  console.log("----- ----- -----");
  const lines = doc.pageContent.split("\n");
  const rows = lines.map((line) => {
    return [
      line.slice(0, line.indexOf(":")),
      line.slice(line.indexOf(":") + 2, line.length),
    ];
  });
  const original = Object.fromEntries(rows);
  console.log("original:", original);
  const res = await chain.call({
    input_documents: [doc],
  });
  const result = {
    id: original.id,
    title: original.title,
    generatedSummary: res.text,
  };
  results.push(result);
  console.log("generated:", result);

  console.log("----- ----- -----");
}

// 要約結果をファイルに保存
fs.writeFileSync(
  "public/supportSummaries.json",
  JSON.stringify(results, null, 2)
);
