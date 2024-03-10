import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { db } from "@/db";
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
    where:{
      id:fileId,
      userId:dbUserID?.id
    }
  });
  if(!file) notFound();
  return <div>{fileId}</div>;
}
