import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { pinecone } from "@/lib/Pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe.lib";
import { PLANS } from "@/config/stripe.config";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
  const subscriptionPlan = await getUserSubscriptionPlan();
  const dbUser = await db.user.findUnique({
    where: {
      email: user.email,
    },
  });
  return { subscriptionPlan, userID: dbUser?.id };
};

const onUploadComplete = async ({metadata,file}: {metadata: Awaited<ReturnType<typeof middleware>>;file: { key: string; name: string; url: string };}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });
  if (isFileExist) return;

  const createFile = await db.file.create({
    data: {
      name: file.name,
      key: file.key,
      userId: metadata.userID,
      url: file.url,
      uploadStatus: "PROCESSING",
    },
  });
  try {
    const res = await fetch(file.url);

    const blob = await res.blob();
    const loader = new PDFLoader(blob);

    const docs = await loader.load();
    const pagesAMT = docs.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pagesAMT > PLANS.find((page) => page.name === "Pro")!.pagePerPdf;
    const isFreeExceeded =
      pagesAMT > PLANS.find((page) => page.name === "Free")!.pagePerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: createFile.id,
        },
      });
    }

    //Vectorize and index entire document
    const pineconeIndex = pinecone.Index("unveil");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: createFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createFile.id,
      },
    });
  } catch (err) {
    console.log(err);
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createFile.id,
      },
    });
  }
};
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
