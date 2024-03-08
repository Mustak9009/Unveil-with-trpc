import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const appRouter = router({
  authCallBack: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession(); //From kinde server 
    const user = await getUser();
    if (!user?.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const dbUser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles:privateProcedure.query(async ({ctx})=>{
    const {user,userId} = ctx;
    return await db.file.findMany({
      where:{
        userId
      }
    })
  })
});

export type AppRouter = typeof appRouter;
