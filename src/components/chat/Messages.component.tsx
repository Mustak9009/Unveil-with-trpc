import React, { useContext, useEffect, useRef } from "react";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query.config";
import { trpc } from "@/trpc/client";
import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message.component";
import { ChatContext } from "./ChatContext.context";
import {useIntersection} from '@mantine/hooks';
interface MessagesPropsType {
  fileId: string;
}
export default function Messages({ fileId }: MessagesPropsType) {
  const { isLoading: isAiThinking } = useContext(ChatContext);
  const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery(
      { fileId, limit: INFINITE_QUERY_LIMIT },
      {
        getNextPageParam: (lastData) => lastData.nextCursor,
      }
    );
  const messages = data?.pages.flatMap((message) => message.messages);
  const lastMessageREF = useRef<HTMLDivElement>(null);
  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
    text: (
      <span className="flex justify-center items-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };
  const combineMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const {ref,entry} = useIntersection({
    root:lastMessageREF.current,
    threshold:1
  })

  useEffect(()=>{
    if(entry?.isIntersecting){
      fetchNextPage()

    }
  },[entry,fetchNextPage]);
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3  overflow-y-auto  scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter">
      {combineMessages && combineMessages.length > 0 ? (
        combineMessages.map((message, i) => {
          const isNextMessageFromSamePerson =
            combineMessages[i - 1]?.isUserMessage ===
            combineMessages[i]?.isUserMessage;
          if (i === combineMessages.length - 1) {
            return (
              <Message
                ref={ref}
                key={message.id}
                {...{ message, isNextMessageFromSamePerson }}
              />
            );
          } else
            return (
              <Message
                key={message.id}
                {...{ message, isNextMessageFromSamePerson }}
              />
            );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-black" />
          <h3>You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started
          </p>
        </div>
      )}
    </div>
  );
}
