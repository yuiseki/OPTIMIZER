import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import path from "path";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let query = undefined;
  const { query: queryInQuery } = req.query;
  if (queryInQuery !== undefined) {
    query = queryInQuery;
  }
  const { query: queryInBody } = req.body;
  if (queryInBody !== undefined) {
    query = queryInBody;
  }
  if (query === undefined) {
    res.status(400).json({ status: "ng", message: "query is missing" });
    return;
  }
  const queryString = query as string;
  if (queryString.length > 400) {
    res.status(400).json({ status: "ng", message: "query is too long" });
    return;
  }

  if (
    queryString.toLowerCase().includes("ignore") ||
    queryString.toLowerCase().includes("instruction")
  ) {
    res.status(400).json({ status: "ng", message: "invalid query" });
    return;
  }

  const directory = path.resolve("public", "vector_store", "summarized");
  const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

  const results = await vectorStore.similaritySearchWithScore(queryString, 10);

  const programs = results.map((result) => {
    const rows = result[0].pageContent.split("\n").map((line) => {
      return [
        line.slice(0, line.indexOf(":")),
        line.slice(line.indexOf(":") + 2, line.length),
      ];
    });
    const original = Object.fromEntries(rows);
    original.similarity = result[1];
    return original;
  });

  const programsText = programs
    .slice(0, 5)
    .map((program) => {
      return `- ${program.title}\n    - ${program.generatedSummary}\n`;
    })
    .join("\n");

  let completionText =
    "あなたの状況を改善するために、以下の制度を活用することを検討してください。";

  process.env.TZ = "Asia/Tokyo";
  const nowDate = new Date();
  console.log(nowDate.toLocaleString());
  const limitDate = new Date("2023-04-22 21:00");
  console.log(limitDate.toLocaleString());
  const condition = nowDate.getTime() < limitDate.getTime();

  if (condition) {
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Transfer-Encoding": "chunked",
    });
    const llm = new OpenAI({
      temperature: 0,
      maxTokens: 1000,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken: (token: string) => {
            res.write(`${token}`);
          },
        },
      ],
    });
    const promptTemplate = new PromptTemplate({
      template: `
あなたはユーザーの状況を改善し、ユーザーの要望を叶える、有用なアシスタントである。

ユーザーの状況または要望:
{user_query}

有用と思われる制度の情報:
{programs}

ユーザーの状況を改善するために、あるいはユーザーの要望を叶えるために、これらの制度がいかに役立つかをユーザーに紹介する文章:
    `,
      inputVariables: ["user_query", "programs"],
    });
    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: llm,
    });
    const completionRes = await chain.call({
      user_query: query,
      programs: programsText,
    });
    console.log(completionRes);
    res.end();
  } else {
    res.status(200).json({
      programsText: programsText,
      completionText: completionText,
      query: query,
      programs: programs,
    });
  }
}