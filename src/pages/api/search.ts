import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  if (query === undefined) {
    res.status(400).json({ status: "ng", message: "query is too long" });
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

  const directory = "public/vector_store";
  const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

  const result = await vectorStore.similaritySearchWithScore(queryString, 10);
  res.status(200).json(result);
}
