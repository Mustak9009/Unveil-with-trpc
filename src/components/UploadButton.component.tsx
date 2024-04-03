"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import DropZone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useUploadThing } from "@/lib/uploadthing";
import { ToastAction } from "./ui/toast";
import { toast } from "./ui/use-toast";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

const UploadDropZone = ({isSubscribed}:{isSubscribed:boolean}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingProgress, setUploadingProgress] = useState<number>(0);
  const { startUpload } = useUploadThing(isSubscribed?'proPlanUploader':'freePlanUploader');
  const router = useRouter();
  const { mutate: startPolling } = trpc.getFile.useMutation({
    //Api polling
    onSuccess: (file) => {
      router.push(`/admin/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });
  const startSimulatedProgress = () => {
    const interval = setInterval(() => {
      setUploadingProgress((preProgress) => {
        if (preProgress >= 95) {
          clearInterval(interval);
          return preProgress;
        }
        return preProgress + 5;
      });
    }, 500);
    return interval;
  };
  const onDropHandler = async (acceptedFile: File[]) => {
    setIsUploading(true);
    //Hnadeling file uploading

    const progressInterval = startSimulatedProgress();
    const res = await startUpload(acceptedFile);
    if (!res)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive",
      });

    const [fileResponse] = res; //convert arry to Obj
    const key = fileResponse.key;
    if (!key)
      return toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
        variant: "destructive",
      });

    clearInterval(progressInterval);
    setUploadingProgress(100);
    startPolling({ key });
  };
  return (
    <DropZone
      multiple={false}
      onDrop={(acceptedFile) => onDropHandler(acceptedFile)}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="h-64 m-4 border border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex justify-center items-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col justify-center items-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center justify-center flex-col text-center pt-5 pb-6">
                <Cloud className="w-6 h-6 text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-700 mb-2">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (Up to {isSubscribed ? '16' : '4'}MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-1 outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4" />
                  </div>
                  <p className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </p>
                </div>
              ) : null}
              {isUploading ? (
                <div className="max-w-xs mx-auto w-full mt-4">
                  <Progress
                    value={uploadingProgress}
                    indicatorColor={uploadingProgress === 100 ? 'bg-green-500' : ''}
                    className="h-1 w-full bg-zinc-200"
                  />
                  {uploadingProgress === 100 ? (
                    <div className="flex justify-center items-center gap-1 text-sm text-center text-zinc-700 pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Redirecting . . .</span>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
                accept="application/pdf"
              />
            </label>
          </div>
        </div>
      )}
    </DropZone>
  );
};
export default function UploadButton({isSubscribed}:{isSubscribed:boolean}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-md">
        <UploadDropZone isSubscribed={isSubscribed}/>
      </DialogContent>
    </Dialog>
  );
}
