import { handleAuth } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest,{  params }: {params:{kindeAuth:string}}) { 
  const endpoint = params.kindeAuth
  //@ts-ignore
  return handleAuth(request, endpoint)
}