import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper.component";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe.config";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import UpgradeButton from "@/components/UpgradeButton.component";
const pricingItems = [
  {
    plan: "Free",
    tagline: "For small side projects.",
    quota: 10,
    features: [
      {
        text: "5 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        negative: true,
      },
      {
        text: "Priority support",
        negative: true,
      },
    ],
  },
  {
    plan: "Pro",
    tagline: "For larger projects with higher needs.",
    quota: PLANS.find((p) => p.slug === "pro")!.quota,
    features: [
      {
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      {
        text: "Priority support",
      },
    ],
  },
];
export default async function page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <MaxWidthWrapper className="text-center mb-8 mt-24 max-w-5xl">
      <div className="mx-auto sm:max-w-lg mb-10">
        <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
        <p className="text-gray-600 mt-5 sm:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 pt-12">
        <TooltipProvider>
          {pricingItems.map(({ plan, tagline, quota, features }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0;

            return (
              <div
                key={plan}
                className={cn("relative rounded-2xl  bg-white shadow-lg", {
                  "border-2 border-blue-600 shadow-blue-200": plan === "Pro",
                  "border border-gray-200": plan !== "Free",
                })}
              >
                {plan === "Pro" && (
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-foreground to-gray-500 px-3  py-2 text-sm font-medium text-white">
                    Upgrade now
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-center text-3xl font-bold my-3">
                    {plan}
                  </h3>
                  <p className="text-gray-500">{tagline}</p>
                  <p className="text-6xl font-semibold my-5">₹{price}</p>
                  <p className="text-gray-500">Per month</p>
                  <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <p>{quota.toLocaleString()} PDFs/mo included</p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger
                          className="cursor-default ml-1.5"
                          asChild
                        >
                          <HelpCircle className="w-4 h-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          How many PDFs you can upload per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <ul className="my-10 space-y-5 px-8">
                  {features.map(({ text, footnote, negative }) => (
                    <li key={text} className="flex space-x-5">
                      <div className="flex-shrink-0">
                        {negative ? (
                          <Minus className="h-6 w-6 text-gray-300" />
                        ) : (
                          <Check className="h-6 w-6 text-blu-500" />
                        )}
                      </div>
                      {footnote ? (
                        <div className="flex items-center space-x-1">
                          <p
                            className={cn("text-gray-400", {
                              "text-gray-600": negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger
                              className="cursor-default ml-1.5"
                              asChild
                            >
                              <HelpCircle className="w-4 h-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="w-80 p-2">
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn("text-gray-400", {
                            "text-gray-600": negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200" />
                <div className="p-5">
                  {plan === "Free" ? (
                    <Link
                      href={user ? '/admin' : "/sign-in"}
                      className={buttonVariants({ className: "w-full",variant:"secondary"})}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="w-5 h-5 ml-1.5" />
                    </Link>
                  ) : user ? (
                    <UpgradeButton />
                  ) : (
                    <Link
                      href={"/sign-in"}
                      className={buttonVariants({ className: "w-full" })}
                    >
                      {user ? "Upgrade now" : "Sign up"}
                      <ArrowRight className="w-5 h-5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  );
}
