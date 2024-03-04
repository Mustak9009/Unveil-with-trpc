import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server';
import { router,publicProcedure } from './trpc';
import { TRPCError } from '@trpc/server';
export const appRouter = router({
  authCallBack:publicProcedure.query(async ()=>{
    const {getUser} = getKindeServerSession();
    const user =  getUser();
    if(!user?.id || !user.email) throw new TRPCError({code:'UNAUTHORIZED'})
    
    return {sucess:true}
  })
});

export type AppRouter = typeof appRouter;