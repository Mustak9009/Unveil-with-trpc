"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";

const Loader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { data, error } = trpc.authCallBack.useQuery();
  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/sign-in");
    }
    if (data?.success) {
      router.push(origin ? `/${origin}` : "/admin");
    }
  }, [data, error, router, origin]);
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2 ">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account . . .</h3>
        <p>You will be redirect automatically</p>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Loader />
    </Suspense>
  );
}
