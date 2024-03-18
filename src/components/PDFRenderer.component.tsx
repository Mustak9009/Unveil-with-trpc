"use client";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import { cn } from "@/lib/utils";
import SimpleBar from "simplebar-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PDFFullScreen from "./PDFFullScreen.component";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFRendererProps {
  url: string;
}

export default function PDFRenderer({ url }: PDFRendererProps) {
  const { width, ref: ResizeREf } = useResizeDetector();

  const [numPages, setNumPages] = useState<number | null | undefined>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((page) => Number(page) > 0 && Number(page) <= numPages!),
  });

  type CustomValidatorType = z.infer<typeof CustomPageValidator>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomValidatorType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });
  const handlePageSubmit = ({ page }: CustomValidatorType) => {
    setCurrentPage(Number(page));
  };
  useEffect(() => {
    setValue("page", String(currentPage));
  }, [currentPage, setValue]);
  return (
    <div className="w-full flex flex-col items-center shadow bg-white rounded-md">
      <div className="w-full h-full sm:h-14 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} //For pagination Math.max and .min is cool
            aria-label="previous page"
            variant={"ghost"}
          >
            {" "}
            {/** prev-1 is better then pre >= 1 statement */}
            <ChevronDown calcMode="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8 focus-visible:ring-transparent",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-sm text-zinc-700 space-x-1">
              <span>/</span>
              <span>{numPages ?? "X"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || numPages! === currentPage}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, numPages ?? 1))
            } //We set numPages ?? 1 -> as because numPages will be null or undefiend
            aria-label="previous page"
            variant={"ghost"}
          >
            <ChevronUp calcMode="w-4 h-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant={"ghost"}>
                <Search className="w-4 h-4" />
                <span>{scale * 100}%</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Zoom</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(3)}>
                  300%
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            variant={"ghost"}
            aria-label="rotate 90 degrees"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <PDFFullScreen fileURL={url} />
        </div>
      </div>
      <div className="w-full flex-1 max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}
              <Page
                  className={cn(isLoading ? 'hidden' : '')}
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  key={'@' + scale}
                  rotate={rotation}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 w-6 h-6 animate-spin"/>
                    </div>
                  }
                  onRenderSuccess={()=>setRenderedScale(scale)}
                />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
