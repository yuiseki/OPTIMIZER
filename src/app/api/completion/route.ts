import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// Retrieval (the old HNSWLib + OpenAIEmbeddings vector search) now runs
// client-side (see src/lib/rag); this route only takes the already-retrieved
// program text and streams the LLM's generated response back. No native
// bindings, no filesystem access, so this is Workers-safe.
const PROMPT = new PromptTemplate({
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

export async function POST(request: Request) {
  const body = await request.json();
  const query = typeof body.query === "string" ? body.query : undefined;
  if (!query) {
    return new Response(JSON.stringify({ status: "ng", message: "query is missing" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (query.length > 400) {
    return new Response(JSON.stringify({ status: "ng", message: "query is too long" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (query.toLowerCase().includes("ignore") || query.toLowerCase().includes("instruction")) {
    return new Response(JSON.stringify({ status: "ng", message: "invalid query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const programs = typeof body.programs === "string" ? body.programs : "";
  const areaPrograms =
    typeof body.areaPrograms === "string" ? body.areaPrograms : "";

  const prompt = await PROMPT.format({
    user_query: query,
    programs,
    area_programs: areaPrograms,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
        maxTokens: 1000,
        streaming: true,
        // See lunatic's migration notes: the openai SDK's Node transport
        // detection misfires under Workers' nodejs_compat and hangs/errors
        // unless fetch is forced explicitly.
        configuration: { fetch: globalThis.fetch },
        callbacks: [
          {
            handleLLMNewToken: (token: string) => {
              controller.enqueue(encoder.encode(token));
            },
          },
        ],
      });
      try {
        await llm.invoke(prompt);
      } catch (err) {
        controller.enqueue(encoder.encode(`\n[error: ${String(err)}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
