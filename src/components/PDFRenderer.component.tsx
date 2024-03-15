"use client";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface PDFRendererProps {
  url: string;
}
export default function PDFRenderer({ url }: PDFRendererProps) {
  const { width, ref: ResizeREf } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | null | undefined>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  return (
    <div className="w-full flex flex-col items-center shadow bg-white rounded-md">
      <div className="w-full h-14 border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() =>
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))
            }
            aria-label="previous page"
            variant={"ghost"}
          >
            {" "}
            {/** prev-1 is better then pre >= 1 statement */}
            <ChevronDown calcMode="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input className="w-12 h-8 focus-visible:ring-transparent" />
            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>
              <span>{numPages ?? "X"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || numPages! === currentPage}
            onClick={() =>
              setCurrentPage((prev) =>
                prev + 1 < numPages! ? prev + 1 : numPages!
              )
            }
            aria-label="previous page"
            variant={"ghost"}
          >
            <ChevronUp calcMode="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="w-full flex-1 max-h-screen">
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
            file={url}
            className={"max-h-full"}
          >
            <Page width={width ? width : 1} pageNumber={currentPage} />
          </Document>
        </div>
      </div>
    </div>
  );
}
