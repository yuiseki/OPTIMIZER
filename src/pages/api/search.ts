import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.body;
  if (query.length > 400) {
    res.status(400).json({ status: "ng", message: "query is too long" });
    return;
  }

  const directory = "public/vector_store";
  const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

  const result = await vectorStore.similaritySearch(query, 1);
  console.log(result);
  res.status(200).json(result);
}
