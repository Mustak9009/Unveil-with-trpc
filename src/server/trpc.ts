import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';
const t = initTRPC.create();

export const router = t.router;
const middleware  = t.middleware(async(opt)=>{
    const {getUser,isAuthenticated} = getKindeServerSession()
    const user = await getUser();
    if(!user || !user.id || !user.email || !isAuthenticated){
        throw new TRPCError({code:'UNAUTHORIZED'})
    }
    const dbUser = await db.user.findUnique({where:{
        email:user.email
    }});
    return opt.next({
        ctx:{
            user,
            userId:dbUser?.id
        }
    });
})
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(middleware)