"use client";
import React, { useState } from "react";
import Link from 'next/link';
import {format} from 'date-fns'
import { trpc } from "@/trpc/client";
import { Button } from "./ui/button";
import Skeleton from "react-loading-skeleton";
import UploadButton from "@/components/UploadButton.component";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
export default function Dashboard() {
  const utils = trpc.useUtils()
  const [currentDelitingFile,setCurrentDelitingFile] = useState<string | null>(null)
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const {mutate:deleteFile} = trpc.deleteFile.useMutation({
    onSuccess:()=>{
        utils.getUserFiles.invalidate()
    },
    onMutate:({id})=>{
      setCurrentDelitingFile(id)
    },
    onSettled(){ //We are also write like this
      setCurrentDelitingFile(null)
    }
  });
  return (
    <main className="max-w-7xl mx-auto md:p-10 px-3">
      <div className="flex flex-col justify-between items-start gap-4 border-b border-gray-200 pb-5 mt-8 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="text-5xl font-bold mb-3 text-gray-900">My Files</h1>
        <UploadButton />
      </div>
      {/* Display all files */}
      {files && files.length !== 0 ? (
        <ul className="grid grid-cols-1 gap-6 divide-y-2 divide-zinc-200 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file)=>(
              <li key={file.id} className="col-span-1 divide-y divide-gray-200 bg-white rounded shadow transition hover:shadow-lg">
                <Link href={`/admin/${file.id}`} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center space-x-6 w-full pt-6 px-6">
                      <div className="flex-shrink-0 rounded-full bg-gradient-to-r from-[#28313B] to-[#485461] h-10 w-10" aria-hidden/>
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-y-3">
                           <h3 className="font-medium text-lg truncate hover:underline">{file.name}</h3>
                        </div>
                      </div>
                  </div>
                </Link>
                <div className="grid grid-cols-3 place-items-center gap-6 text-xs text-zinc-500 px-3 py-2 mt-4">
                  <div className="flex items-center gap-2" aria-label="Date">
                    <Plus className="h-4 w-4"/>
                    <span>{format(new Date(file.createdAt),'MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2" aria-label="Message">
                    <MessageSquare className="w-4 h-4"/>
                    <span>Mocked</span>
                  </div>
                  <Button onClick={()=>deleteFile({id:file.id})} size={'sm'}  className="w-full" variant={'destructive'}  aria-label="Delete" >
                    {currentDelitingFile !== file.id ? (
                      <Trash className="w-4 h-4"/>
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-inherit"/>
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} count={3} className="my-2" />
      ) : (
        <div className="flex flex-col justify-center items-center mt-16 gap-2">
          <Ghost className="w-8 h-8 text-zinc-800" />
          <section className="text-center">
            <h2 className="text-xl font-semibold">Pretty empty around here</h2>
            <p>Let&apos;s upload your first PDF.</p>
          </section>
        </div>
      )}
    </main>
  );
}
