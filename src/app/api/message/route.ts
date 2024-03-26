import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { sendMessageValidator } from "@/lib/validator/sendMessage";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { pinecone } from "@/lib/Pinecone";
import { NextRequest } from "next/server";
import { OpenAi } from "@/lib/openai";
import { db } from "@/db";
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  //Get -> user from DB
  const dbUserID = await db.user.findUnique({
    where: {
      email: user.email!,
    },
    select: {
      id: true,
    },
  });
  if (!dbUserID) return new Response("Unauthorized", { status: 401 });
  const { fileId, message } = sendMessageValidator.parse(body);

  //GEt -> file from DB
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: dbUserID.id,
    },
  });
  if (!file) return new Response("Not found", { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      fileId,
      userId: dbUserID.id,
    },
  });
  //1: Vectorize messages
  const pineconeIndex = pinecone.Index("unveil");
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);
  const prevmessages = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });
  const formattedPrevMessages = await prevmessages.map((msg) => ({
    role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: msg.text,
  }));

  const response = await OpenAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
      
      \n----------------\n

      PREVIOUS CONVERSATION:
      ${formattedPrevMessages.map((message) => {
        if (message.role === "user") return `User: ${message.content}\n`;
        return `Assistant: ${message.content}\n`;
      })}

      \n----------------\n

      CONTEXT:
      ${results.map((r) => r.pageContent).join("\n\n")}

      USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    //For that resion we don't use `trpc`
    async onCompletion(completions) {
      await db.message.create({
        data: {
          text: completions,
          isUserMessage: false,
          userId: dbUserID.id,
          fileId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
