import React, { forwardRef } from "react";
import { ExtendedMessage } from "@/types/messages.types";
import { cn } from "@/lib/utils";
import { Icons } from "../Icons.component";
import Reactmarkdown from "react-markdown";
import { format } from "date-fns";
interface MessagePropsType {
  message: ExtendedMessage;
  isNextMessageFromSamePerson: boolean;
}
export default forwardRef<HTMLDivElement, MessagePropsType>(function Message({ message, isNextMessageFromSamePerson },ref) {
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": message.isUserMessage,
      })}
      ref={ref}
    >
      <div
        className={cn(
          "relative flex justify-center items-center h-6 w-6 aspect-square",
          {
            "order-2  bg-gray-800 rounded-sm": message.isUserMessage,
            "order-1  bg-gray-800 rounded-sm": !message.isUserMessage,
            invisible: isNextMessageFromSamePerson,
          }
        )}
      >
        {message.isUserMessage ? (
          <Icons.user className="fill-zinc-200 text-zinc-200 h-3/4 w-3/4" />
        ) : (
          <Icons.logo className="fill-zinc-200  h-3/4 w-3/4" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage,
          "order-2 items-start": !message.isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-gray-900 text-white": message.isUserMessage,
            "bg-gray-200 text-gray-900": !message.isUserMessage,
            "rounded-br-none":
              isNextMessageFromSamePerson && message.isUserMessage,
            "rounded-bl-none":
              !isNextMessageFromSamePerson && !message.isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <Reactmarkdown
              className={cn("prose", {
                "text-zinc-50": message.isUserMessage,
              })}
            >
              {message.text}
            </Reactmarkdown>
          ) : (
            message.text
          )}
          {message.id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                "text-blue-300": message.isUserMessage,
                "text-gray-500": !message.isUserMessage,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});
