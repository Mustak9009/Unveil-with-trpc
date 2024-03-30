"use client";
import React, { ReactNode, createContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";
import { trpc } from "@/trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query.config";
type StreamResponse = {
  addMessages: () => void;
  message: string;
  handleInputChanges: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessages: () => {},
  message: "",
  handleInputChanges: () => {},
  isLoading: false,
});
interface PropsType {
  fileId: string;
  children: ReactNode;
}
export const ChatContextProvider = ({ fileId, children }: PropsType) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, seIsLoading] = useState<boolean>(false);

  const utils = trpc.useUtils();
  const backUpmessage = useRef("");
  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ fileId, message }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.body;
    },
    onMutate: async ({ message }) => {
      //For optamistic update
      backUpmessage.current = message;
      setMessage("");
      //Step - 1
      await utils.getFileMessages.cancel();
      //Step - 2
      const previousMessages = utils.getFileMessages.getInfiniteData();
      //Step - 3
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }
          let newPages = [...old.pages];
          let lastPage = newPages[0]!;

          lastPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...lastPage.messages,
          ];
          newPages[0] = lastPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );
      seIsLoading(true);
      return {
        previousMessage:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      seIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      //Accimulated response
      let accResponse = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        accResponse += chunkValue;

        //Append chunk to the actual message
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              };
            }
            let isAiResponseCreated = old.pages.some((page) =>
              page.messages.some((message) => message.id === "ai-response")
            );

            let updatePages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updateMessages;
                if (!isAiResponseCreated) {
                  updateMessages = [
                    {
                      id: "ai-response",
                      createdAt: new Date().toISOString(),
                      isUserMessage: false,
                      text: accResponse,
                    },
                    ...page.messages,
                  ];
                } else {
                  updateMessages = page.messages.map((message) => {
                    if (message.id === "ai-response") {
                      return {
                        ...message,
                        text: accResponse,
                      };
                    }
                    return message;
                  });
                }
                return {
                  ...page,
                  messages: updateMessages,
                };
              }

              return page;
            });
            return {
              ...old,
              pages: updatePages,
            };
          }
        );
      } 
    },
    onError: (_, __, context) => {
      setMessage(backUpmessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessage ?? [] }
      );
    },
    onSettled: async () => {
      seIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });
  const addMessages = () => sendMessage({ message });
  const handleInputChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  return (
    <ChatContext.Provider
      value={{ addMessages, handleInputChanges, isLoading, message }}
    >
      {children}
    </ChatContext.Provider>
  );
};
