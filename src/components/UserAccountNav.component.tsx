import { getUserSubscriptionPlan } from "@/lib/stripe.lib";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Icons } from "./Icons.component";
import Link from "next/link";
import { Gem } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

interface UserAccountNavPropsType {
  email: string | undefined;
  imageURL: string;
  name: string;
}

export default async function UserAccountNav({
  email,
  imageURL,
  name,
}: UserAccountNavPropsType) {
  const subscriptionPlan = await getUserSubscriptionPlan();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="overflow-visible" asChild>
        <Button className="w-8 h-8 rounded-full aspect-square bg-slate-400">
          <Avatar className="relative w-8 h-8">
            {imageURL ? (
              <div className="relative w-full h-full aspect-square">
                <Image
                  src={imageURL}
                  alt="Profile avatar"
                  referrerPolicy="no-referrer"
                  fill
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <Icons.user className="w-4 h-4 text-zinc-900" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex justify-start items-center gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name ? (
              <p className="font-semibold text-sm text-black">{name}</p>
            ) : null}
            {email ? (
              <p className="truncate w-[200px] text-xs text-zinc-600">
                {email}
              </p>
            ) : null}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={"/admin"}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {subscriptionPlan.isSubscribed ? (
            <Link href={"/admin/billing"}>Manage Subscription</Link>
          ) : (
            <Link href={"/pricing"} className="w-full flex justify-between items-center">
              Upgrade <Gem className="text-gray-600 w-4 h-4 self-center ml-auto" />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer focus:bg-red-400 focus:text-white">
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
