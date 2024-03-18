import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "./ui/use-toast";
interface PDFFullScreenPropsType {
  fileURL: string;
}
export default function PDFFullScreen({ fileURL }: PDFFullScreenPropsType) {
  const { width, ref: ResizeREf } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | null | undefined>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} aria-label="Full screen">
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-7xl">
        <SimpleBar className="max-h-[calc(100vh-10rem)] mt-6" autoHide={false}>
          <div ref={ResizeREf}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              file={fileURL}
              className={"max-h-full"}
            >
              {new Array(numPages).fill(null).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}
