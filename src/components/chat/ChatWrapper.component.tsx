"use client";
import React from "react";
import Messages from "./Messages.component";
import ChatInput from "./ChatInput.component";
import { trpc } from "@/trpc/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface ChatWrapperPropsType {
  fileId: string;
}

export default function ChatWrapper({ fileId }: ChatWrapperPropsType) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data.state.data?.status === "SUCCESS" ||
        data.state.data?.status === "FAILED"
          ? false
          : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-full relative bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8  text-gray-500 animate-spin" />
            <h2 className="font-semibold text-xl">Loading . . .</h2>
            <p className="text-zinc-500 text-sm">We&apos;re preparing your PDF.</p>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );
  }
  if (data?.status === "PROCESSING") {
    return (
      <div className="min-h-full relative bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8  text-gray-500 animate-spin" />
            <h2 className="font-semibold text-xl">Process your PDF . . .</h2>
            <p className="text-zinc-500 text-sm">This won&apos;t take long.</p>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );
  }
  if (data?.status === "FAILED") {
    return (
      <div className="min-h-full relative bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8  text-red-500" />
            <h2 className="font-semibold text-xl">Too many pages in PDF.</h2>
            <p className="text-zinc-500 text-sm">
              You <span className="font-bold">Free</span> plan supports up to 5
              pages per PDF.
            </p>
            <Link href={'/admin'} className={buttonVariants({variant:"secondary",className:'mt-4'})}>
              <ChevronLeft className="w-4 h-4 mr-1"/>
              <span>Back</span>
            </Link>
          </div>
        </div>
        <ChatInput isDisabled={true} />
      </div>
    );
  }
  return (
    <div className="min-h-full relative bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200">
      <div className="flex-1 flex justify-between flex-col mb-28">
        <Messages />
      </div>
      <ChatInput />
    </div>
  );
}
