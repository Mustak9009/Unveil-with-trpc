import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { db } from "@/db";
import { INFINITE_QUERY_CONFIG } from "@/config/infinite-query.config";
export const utapi = new UTApi();
const getDbUser = async (email: string) => {
  const dbUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  return { dbUser, id: dbUser?.id };
};
export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession(); //From kinde server
    const user = await getUser();
    if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const { dbUser } = await getDbUser(user.email);

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
    return await db.file.findMany({
      where: {
        userId: ctx.userId,
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
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
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
      const file = await db.file.findFirst({
        where: {
          userId: ctx.userId,
          key: input.key,
        },
      });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });
      if (!file) return { status: "PENDING" as const };
      return { status: file.uploadStatus };
    }),
  getFileMessage: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async({ctx,input}) => {
      const {userId} = ctx;
      const {fileId,cursor} = input;
      const limit = input.limit ?? INFINITE_QUERY_CONFIG; 

      const file = await db.file.findFirst({
        where:{
          id:fileId,
          userId
        }
      });
      if(!file) throw new TRPCError({code:'NOT_FOUND'});

      const messages = await db.message.findMany({
        take:limit + 1, // + 1 for database call
        where:{
          fileId
        },
        orderBy:{
          createdAt:'desc'
        },
        cursor:cursor ? {id:cursor} : undefined,
        select:{
          id:true,
          text:true,
          isUserMessage:true,
          createdAt:true
        }
      });
      let nextCursor: typeof cursor | undefined = undefined;

      if(messages.length > limit){
        const nextItem = messages.pop(); //Remove `+ 1` obj
        nextCursor = nextItem?.id
      }
      return{
        messages,
        nextCursor 
      }
    }),
});

export type AppRouter = typeof appRouter;
