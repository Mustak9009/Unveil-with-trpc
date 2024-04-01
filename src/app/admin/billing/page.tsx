import React from "react";
import { getUserSubscriptionPlan } from "@/lib/stripe.lib";
import BillingForm from "@/components/BillingForm.component";

export default async function page() {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return <BillingForm subscriptionPlan={subscriptionPlan}/>
}
