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

  // デジタル庁の制度を探す
  const digitalAgencyDir = path.resolve(
    "public",
    "data",
    "DigitalAgency",
    "vector_stores",
    "summarized"
  );
  const digitalAgencyVectorStore = await HNSWLib.load(
    digitalAgencyDir,
    new OpenAIEmbeddings()
  );
  const digitalAgencyResults =
    await digitalAgencyVectorStore.similaritySearchWithScore(queryString, 10);
  const digitalAgencyPrograms = digitalAgencyResults.map((result) => {
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
  const digitalAgencyProgramsText = digitalAgencyPrograms
    .slice(0, 3)
    .map((program) => {
      return `- ${program.title}\n    - ${program.generatedSummary}\n`;
    })
    .join("\n");

  // 台東区の制度を探す
  const tokyoTaitoDir = path.resolve(
    "public",
    "data",
    "Tokyo",
    "Taito",
    "vector_stores",
    "summarized"
  );
  const tokyoTaitoVectorStore = await HNSWLib.load(
    tokyoTaitoDir,
    new OpenAIEmbeddings()
  );
  const tokyoTaitoResults =
    await tokyoTaitoVectorStore.similaritySearchWithScore(queryString, 10);
  const tokyoTaitoProgramsText = tokyoTaitoResults
    .slice(0, 3)
    .map((program) => {
      return `- ${program[0].pageContent}\n`;
    })
    .join("\n");

  let completionText =
    "あなたの状況を改善するために、以下の制度を活用することを検討してください。";

  process.env.TZ = "Asia/Tokyo";
  const nowDate = new Date();
  console.log(nowDate.toLocaleString());
  const limitDate = new Date("2023-04-29 21:00");
  console.log(limitDate.toLocaleString());
  const condition = nowDate.getTime() < limitDate.getTime();

  if (condition) {
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream",
      "Transfer-Encoding": "chunked",
    });
    res.flushHeaders();
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

有用と思われる地域の制度の情報:
{area_programs}

ユーザーの状況を改善するために、あるいはユーザーの要望を叶えるために、これらの制度のうち、ユーザーの役立つものを簡潔かつ丁寧に紹介する文章:
    `,
      inputVariables: ["user_query", "programs", "area_programs"],
    });
    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: llm,
    });
    const completionRes = await chain.call({
      user_query: query,
      programs: digitalAgencyProgramsText,
      area_programs: tokyoTaitoProgramsText,
    });
    console.log(completionRes);
    res.end();
  } else {
    res.status(200).json({
      programsText: digitalAgencyProgramsText,
      completionText: completionText,
      query: query,
      programs: digitalAgencyPrograms,
    });
  }
}
