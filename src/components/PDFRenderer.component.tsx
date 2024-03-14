"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "./ui/use-toast";
import {useResizeDetector} from 'react-resize-detector';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface PDFRendererProps {
  url: string;
}
export default function PDFRenderer({ url }: PDFRendererProps) {
  const {width,ref:ResizeREf} = useResizeDetector();
  return (
    <div className="w-full flex flex-col items-center shadow bg-white rounded-md">
      <div className="w-full h-14 border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">Top ber</div>
      </div>
      <div className="w-full flex-1 max-h-screen">
        <div ref={ResizeREf}>
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onError={() => {
              toast({
                title: "Error loading PDF",
                description: "Please try again later",
                variant: "destructive",
              });
            }}
            file={url}
            className={"max-h-full"}
          >
            <Page width={width ? width : 1} pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  );
}
