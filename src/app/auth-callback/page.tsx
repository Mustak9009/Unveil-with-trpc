'use client'
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {trpc} from '@/trpc/client';
export default  function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin')
  const {data} = trpc.authCallBack.useQuery()
  if(data?.success){
    router.push(origin ? `/${origin}` : '/dashboard')
  }
  console.log(data)
  return <div>page</div>;
}
