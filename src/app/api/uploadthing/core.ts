import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  pdfUpLoader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const {getUser} = getKindeServerSession();
      const user = await getUser();
      if(!user || !user.id) throw new TRPCError({code:'UNAUTHORIZED'})
      return {userID:user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
