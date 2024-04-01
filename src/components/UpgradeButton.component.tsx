'use client'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { trpc } from '@/trpc/client'

export default function UpgradeButton() {
  const {mutate:createStripeSeesion}  = trpc.createStripeSeesion.useMutation({
    onSuccess:({url})=>{
       window.location.href = url ?? '/admin/billing';
    }
  })
  return (
    <Button onClick={()=>createStripeSeesion()} className='w-full'>
      Upgrade now <ArrowRight className='w-5 h-5 ml-1.5'/>
    </Button>
  )
}
