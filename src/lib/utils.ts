import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absolutePath(path:string){
  if(typeof window !== 'undefined') return path;
  if(process.env.DOMAIN) return `https://${process.env.DOMAIN}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export function constructMetadata({
  title = "Unveli - the SaaS for students",
  description = "Unveli is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@mustak"
    },
    icons,
    metadataBase: new URL('https://unveil-tau.vercel.app/'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}