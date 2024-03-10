import React from "react";
import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import PDFRenderer from "@/components/PDFRenderer.component";
import ChatWrapper from "@/components/ChatWrapper.component";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
interface PageProps {
  params: {
    fileId: string;
  };
}
export default async function page({ params }: PageProps) {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.email) redirect(`/auth-callback?origin=admin/${fileId}`);
  const dbUserID = await db.user.findUnique({ where: { email: user.email } });
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: dbUserID?.id,
    },
  });
  if (!file) notFound();
  return (
    <div className="flex justify-between flex-col flex-1 h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-7xl mx-auto grow lg:flex xl:px-2">
        {/* Left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer />
          </div>
        </div>
        {/* Right side */}
        <div className="flex-[0.75] shrink-0 border-t lg:w-96 lg:border-l lg:border-t-0 border-gray-200">
          <ChatWrapper/>
        </div>
      </div>
    </div>
  );
}
