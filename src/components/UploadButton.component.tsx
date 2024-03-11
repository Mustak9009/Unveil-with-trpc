"use client";
import React from "react";
import {Dialog,DialogTrigger,DialogContent} from '@/components/ui/dialog';
import { Button } from "./ui/button";
import DropZone from 'react-dropzone';
import { Cloud,File } from "lucide-react";
const UploadDropZone = () =>{
  return(
    <DropZone multiple={false} onDrop={(acceptedFile)=>console.log(acceptedFile)}>
      {({getRootProps,getInputProps,acceptedFiles})=>(
        <div {...getRootProps()} className="h-64 m-4 border border-dashed border-gray-300 rounded-lg">
          <div className="flex justify-center items-center h-full w-full">
            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center flex-col text-center pt-5 pb-6">
                <Cloud className="w-6 h-6 text-zinc-500 mb-2"/>
                <p className="text-sm text-zinc-700 mb-2">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (Up to 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-1 outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500"/>
                  </div>
                  <p className="px-3 py-2 h-full text-sm truncate">
                   {acceptedFiles[0].name}
                  </p>
                </div>
              ):null}
            </label>
          </div>
        </div>
      )}
    </DropZone>
  )
}
export default function UploadButton() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-md">
        <UploadDropZone/>
      </DialogContent>
    </Dialog>
  )
}
