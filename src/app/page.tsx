import React from "react";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper.component";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

const BG_Gradient = ({x=11,y=30}:{x?:Number,y?:Number}) =>(
  <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden> {/*transform-gapu -> Help to increase perfomance , pointer-events-none -> It's required here(Because without this clss, the 'get started' button does not clickable)*/}
    <div className={`relative left-[calc(50%-${x.toString().concat('rem')})] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-${y.toString().concat('rem')})] sm:w-[72.1875rem]`} style={{clipPath:'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}/>
  </div>
)
export default function Home() {
  return (
    <React.Fragment>
      <MaxWidthWrapper className="flex flex-col justify-center items-center text-center mb-12 mt-28 sm:mt-40">
        <div className="flex max-w-fit items-center justify-center mx-auto mb-4 space-x-2 overflow-hidden border border-gray-200 bg-white rounded-full px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            Unveil is now public!
          </p>
        </div>
        <section className="flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
            Chat with your <span className="text-blue-600">Documents</span> in
            second.
          </h1>
          <p className="max-w-prose text-zinc-500 sm:text-lg mt-5">
            Unveil  allows you to have conversations with any PDF document. Simply
            upload your file and start asking questions right away.
          </p>
        </section>
        <Link href={"/admin"} target="_blank" className={buttonVariants({ size: "lg", className: "mt-5" })}>
          Get started <ArrowRight className="ml-2 size-5" />
        </Link>
      </MaxWidthWrapper>
      {/* Value proposition section */}
      <div>
        <div className="relative isolate"> {/*class(isolate) -> create a new Stacking context -> https://www.youtube.com/watch?v=o1HzOJfgugE&t=50s */}
          <BG_Gradient />
          <section>
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="bg-gray-900/5 rounded-xl -m-2 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <Image
                    src='/dashboard-preview.jpg'
                    alt='Product preview'
                    width={1364}
                    height={866}
                    quality={100}
                    className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
          </section>
          <BG_Gradient x={13} y={36}/>
        </div>
      </div>
      {/* Feture section */}
      <div  className="max-w-5xl mx-auto my-32 sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <section className="max-w-2xl mx-auto sm:text-center">
            <h2 className="text-4xl font-bold text-gray-900 mt-2 sm:text-5xl">Start chatting in minutes.</h2>
            <p className="text-lg text-gray-500 mt-4">Chatting to your PDF files has never been easier than with Quill.</p>
          </section>
        </div>
        {/* Steps */}
        <ol className="space-y-4 my-8 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="font-medium text-sm text-blue-600">Step 1</span>
              <span className="font-semibold text-xl">Sign up for an account</span>
              <span className='mt-2 text-zinc-500'>
                  Either starting out with a free plan or
                  choose our{' '}
                  <Link href={'/pricing'} className="underline underline-offset-2 text-blue-700">
                    Pro plan.
                  </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="font-medium text-sm text-blue-600">Step 2</span>
              <span className="font-semibold text-xl">Upload your PDF file</span>
              <span className='mt-2 text-zinc-500'>
                We&apos;ll process your file and make it
                ready for you to chat with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 md:border-l-0 md:border-t-2 border-zinc-300 py-2 pl-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="font-medium text-sm text-blue-600">Step 3</span>
              <span className="font-semibold text-xl">Start asking questions</span>
              <span className='mt-2 text-zinc-500'>
                It&apos;s that simple. Try out Quill today -
                it really takes less than a minute.
              </span>
            </div>
          </li>
        </ol>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
              <div className="bg-gray-900/5 rounded-xl -m-2 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                  src='/file-upload-preview.jpg'
                  alt='Uploading preview'
                  width={1419}
                  height={732}
                  quality={100}
                  className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                />
              </div>
            </div>
        </div>
      </div>
    </React.Fragment>
  );
}
