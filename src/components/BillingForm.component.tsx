'use clinet'
import { getUserSubscriptionPlan } from '@/lib/stripe.lib'
import { trpc } from '@/trpc/client'
import React from 'react'
import { toast } from './ui/use-toast'

type BillingFormPropsType = {
    subscriptionPlan:Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}
export default function BillingForm({subscriptionPlan}:BillingFormPropsType) {
    const {} = trpc.createStripeSeesion.useMutation({
        onSuccess:({url})=>{
            if(url) window.location.href = url;
            if(!url) toast({
                title: 'There was a problem...',
                description: 'Please try again in a moment',
                variant:'destructive'
            })
        }
    })
  return (
    <div>BillingForm</div>
  )
}
