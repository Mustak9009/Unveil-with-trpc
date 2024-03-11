"use client";
import React from "react";
import {Dialog,DialogTrigger,DialogContent} from '@/components/ui/dialog';
import { Button } from "./ui/button";
import DropZone from 'react-dropzone';
const UploadDropZone = () =>{
  return(
    <DropZone multiple={false} onDrop={(acceptedFile)=>console.log(acceptedFile)}>
      {({getRootProps,getInputProps,acceptedFiles})=>(
        <div {...getRootProps()} className="h-64 m-4 border border-dashed border-gray-300 rounded-lg">
          <div className="flex justify-center items-center h-full w-full">
            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center flex-col pt-5 pb-6">
                abc
              </div>
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
