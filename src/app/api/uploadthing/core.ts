import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { pinecone } from "@/lib/Pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from '@langchain/pinecone';

const f = createUploadthing();


export const ourFileRouter = {
  pdfUpLoader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
      const dbUser = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });
      return { userID: dbUser?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createFile = await db.file.create({
        data:{
          name:file.name,
          key:file.key,
          userId:metadata.userID,
          url:file.url,
          uploadStatus:'PROCESSING'
        }
      });
      try{
        const res = await fetch(file.url);
        const blob = await res.blob();

        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        //Vectorize and index entire document
        const pineconeIndex = pinecone.Index('unveil');
        const embeddings =  new OpenAIEmbeddings({
          openAIApiKey:process.env.OPENAI_API_KEY
        })

        await PineconeStore.fromDocuments(docs,embeddings,{
          pineconeIndex,
          namespace:createFile.id
        });

        await db.file.update({
          data:{
            uploadStatus:'SUCCESS'
          },
          where:{
            id:createFile.id
          }
        })
      }catch(err){
        await db.file.update({
          data:{
            uploadStatus:'FAILED'
          },
          where:{
            id:createFile.id
          }
        })
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
