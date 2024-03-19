import React from 'react'

type ChatInputPropsType = {
  isDisabled?:boolean
}
export default function ChatInput({isDisabled}:ChatInputPropsType) {
  console.log(isDisabled)
  return (
    <div>Chat</div>
  )
}
