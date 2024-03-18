'use client'
import React from 'react'
import Messages from './Messages.component'
import ChatInput from './ChatInput.component';
import {trpc} from '@/trpc/client';

interface ChatWrapperPropsType{
  fileId:string
}

export default function ChatWrapper({fileId}:ChatWrapperPropsType) {
  const {data} = trpc.getFileUploadStatus.useQuery({fileId},{
  })  
  return (
    <div className='min-h-full relative bg-zinc-50 flex flex-col justify-between gap-2 divide-y divide-zinc-200'>
      <div className="flex-1 flex justify-between flex-col mb-28">
        <Messages/>
      </div>
      <ChatInput/>
    </div>
  )
}
