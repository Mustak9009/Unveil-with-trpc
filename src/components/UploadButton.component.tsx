"use client";
import React from "react";
import {Dialog,DialogTrigger,DialogContent} from '@/components/ui/dialog';
import { Button } from "./ui/button";
export default function UploadButton() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        avc
      </DialogContent>
    </Dialog>
  )
}
