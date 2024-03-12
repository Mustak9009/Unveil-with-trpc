import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "@/db";
const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  pdfUpLoader: f({ image: { maxFileSize: "4MB" } })
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
      })
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
