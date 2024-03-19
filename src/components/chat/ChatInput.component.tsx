import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
type ChatInputPropsType = {
  isDisabled?: boolean;
};
export default function ChatInput({ isDisabled }: ChatInputPropsType) {
  console.log(isDisabled);
  return (
    <div className="w-full absolute left-0 bottom-0">
      <form className="flex flex-row gap-3 mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="h-full relative flex-1 flex items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                maxRows={4}
                className="resize-none pr-12 min-h-full text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
                autoFocus
                placeholder="Enter your quesiton . . ."
              />
              <Button className="absolute bottom-1.5 right-2" aria-label="send message">
                <Send className="w-4 h-4"/>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
