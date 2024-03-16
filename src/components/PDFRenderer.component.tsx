"use client";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import { cn } from "@/lib/utils";
import SimpleBar from 'simplebar-react';
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

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFRendererProps {
  url: string;
}

export default function PDFRenderer({ url }: PDFRendererProps) {
  const { width, ref: ResizeREf } = useResizeDetector();

  const [numPages, setNumPages] = useState<number | null | undefined>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((page) => Number(page) > 0 && Number(page) <= numPages!),
  });

  type CustomValidatorType = z.infer<typeof CustomPageValidator>;
  const {register,handleSubmit,setValue,formState: { errors }} = useForm<CustomValidatorType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: CustomValidatorType) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };
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
              <Page
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
