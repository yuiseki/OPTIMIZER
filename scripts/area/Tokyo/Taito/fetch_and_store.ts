import * as dotenv from "dotenv";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

import fs from "node:fs/promises";

dotenv.config();

const urlsFile = await fs.readFile("public/data/Tokyo/Taito/urls.txt", "utf-8");
const urls = urlsFile.split("\n");
console.info(urls.length);

const docs = [];

for await (const url of urls) {
  console.info(url);
  try {
    const loader = new CheerioWebBaseLoader(url, {
      selector: "main",
    });
    const singleDocs = await loader.load();
    singleDocs[0].pageContent = singleDocs[0].pageContent
      .replaceAll("本文ここから", "")
      .replaceAll("ページID：", "\nページID：")
      .replaceAll("よくある質問", "")
      .replaceAll("メールによるお問い合わせ", "")
      .replaceAll(
        "より使いやすいホームページにするためにご意見をお聞かせください。",
        ""
      )
      .replaceAll("このページの情報は役に立ちましたか？", "")
      .replaceAll("役に立った", "")
      .replaceAll("どちらともいえない", "")
      .replaceAll("役に立たなかった", "")
      .replaceAll("このページの情報は見つけやすかったですか？", "")
      .replaceAll("見つけやすかった", "")
      .replaceAll("見つけにくかった", "")
      .replaceAll(" ", "")
      .replaceAll("　", "")
      .replaceAll("\n\n", "");
    docs.push(singleDocs[0]);
  } catch (error) {
    console.error(error);
  }
}

console.log(docs);
console.log(docs.length);

const vectorStoreSaveDir = "public/data/Tokyo/Taito/vector_stores/base";
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
await vectorStore.save(vectorStoreSaveDir);
