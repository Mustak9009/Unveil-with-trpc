'use client'
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {trpc} from '@/trpc/client';
export default  function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin')
  const {data,isLoading} = trpc.authCallBack.useQuery(undefined,{
    
  })
  return <div>page</div>;
}
