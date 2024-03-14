import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { db } from "@/db";
export const utapi = new UTApi();
const getDbUser = async (email:string)=>{
  const dbUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  return {dbUser,id:dbUser?.id}
}
export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession(); //From kinde server
    const user = await getUser();
    if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const {dbUser} = await getDbUser(user.email);

    if (!dbUser) {
      await db.user.create({
        data: {
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user, userId } = ctx;
    if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const {id} = await getDbUser(user.email);
    return await db.file.findMany({
      where: {
        userId:id,
      },
    });
  }),
  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user,userId } = ctx;
      if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
      const {id} = await getDbUser(user.email);
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId:id,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      await utapi.deleteFiles(file.key); //Delete from -> uploadthing
      return {
        sucess: true,
      };
    }),
  getFile: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, userId } = ctx;
      if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
      const {id} = await getDbUser(user.email);
      const file = await db.file.findFirst({
        where: {
          userId:id,
          key: input.key,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),
});

export type AppRouter = typeof appRouter;
