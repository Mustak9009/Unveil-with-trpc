import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard.component";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe.lib";
export default async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.email) redirect("/auth-callback?origin=admin");
  const dbuser = await db.user.findFirst({
    //Check on DB.
    where: {
      email: user.email,
    },
  });
  if (!dbuser) redirect("/auth-callback?origin=admin");
  const subscriptionPlan = await getUserSubscriptionPlan();
  return <Dashboard subscriptionPlan={subscriptionPlan}/>;
}
