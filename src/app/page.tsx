import Image from "next/image";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper.component";
export default function Home() {
  return (
    <MaxWidthWrapper className="flex flex-col justify-center items-center text-center mb-12 mt-28 sm:mt-40">
      <div className="flex max-w-fit items-center justify-center mx-auto mb-4 space-x-2 overflow-hidden border border-gray-200 bg-white rounded-full px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-gray-700">Quill is now public!</p>
      </div>
    </MaxWidthWrapper>
  );
}
