import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req.body;
  const directory = "public/vector_store";
  const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings());

  const result = await vectorStore.similaritySearch(query, 1);
  console.log(result);
  res.status(200).json({ name: "John Doe" });
}
