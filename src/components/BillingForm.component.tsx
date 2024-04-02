"use client";
import { getUserSubscriptionPlan } from "@/lib/stripe.lib";
import { trpc } from "@/trpc/client";
import React from "react";
import { toast } from "./ui/use-toast";
import { MaxWidthWrapper } from "./MaxWidthWrapper.component";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
type BillingFormPropsType = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};
export default function BillingForm({subscriptionPlan}: BillingFormPropsType) {
  const {mutate:createStripeSeesion,isPending} = trpc.createStripeSeesion.useMutation({
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
      if (!url)
        toast({
          title: "There was a problem...",
          description: "Please try again in a moment",
          variant: "destructive",
        });
    },
  });
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form onSubmit={e=>{
        e.preventDefault();
        createStripeSeesion();
      }} className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Subscription plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-y-0">
            <Button type="submit">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
              {subscriptionPlan.isSubscribed ? "Manage subscription" : "Upgrade to PRO"}
            </Button>
            {subscriptionPlan.isCanceled ? (
              <p className="rounded-full font-medium text-xs">
                {subscriptionPlan.isCanceled ? 'Your plan will be canceled on' : 'Your plan renews on'}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!,'dd.mm.yyyy')}
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}
