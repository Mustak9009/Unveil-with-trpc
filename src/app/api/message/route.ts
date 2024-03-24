import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {NextRequest} from 'next/server';
import {sendMessageValidator} from '@/lib/validator/sendMessage';
import { db } from "@/db";
export const POST = async(req:NextRequest) =>{
    const body = await req.json();
    
    const {getUser} = getKindeServerSession()
    const user = await getUser();
    if(!user) return new Response('Unauthorized',{status:401});
   
    //Get -> user from DB
    const dbUserID = await db.user.findUnique({
        where:{
            email:user.email!
        },
        select:{
            id:true
        }
    })
    if(!dbUserID) return new Response('Unauthorized',{status:401});
    const {fileId,message} = sendMessageValidator.parse(body);

    //GEt -> file from DB
    const file = await db.file.findFirst({
        where:{
            id:fileId,
            userId:dbUserID.id
        }
    });
    if(!file) return new Response('Not found',{status:404});

    await db.message.create({
        data:{
            text:message,
            isUserMessage:true,
            fileId,
            userId:dbUserID.id
        }
    })
    
}