'use client'
import React, {ReactNode, createContext, useState} from 'react';
import { useMutation } from '@tanstack/react-query';
import {toast} from '../ui/use-toast';
type StreamResponse ={
    addMessages:()=>void,
    message:string,
    handleInputChanges:(event:React.ChangeEvent<HTMLTextAreaElement>)=>void,
    isLoading:boolean,
}

export const ChatContext = createContext<StreamResponse>({
    addMessages:()=>{},
    message:'',
    handleInputChanges:()=>{},
    isLoading:false
})
interface PropsType{
    fileId:string,
    children:ReactNode
}
export const ChatContextProvider = ({fileId,children}:PropsType)=>{
    const [message,setMessage] = useState<string>('');
    const [isLoading,seIsLoading] = useState<boolean>(false);

    const {mutate:sendMessage} = useMutation({
        mutationFn:async({message}:{message:string})=>{
            const response = await fetch('/api/message',{
                method:'POST',
                body:JSON.stringify({fileId,message})
            })
            if(!response.ok){
                throw new Error("Failed to send message")
            }
            return response.body;
        }
    })
    const addMessages = ()=> sendMessage({message});
    const handleInputChanges = (e:React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

    return(
        <ChatContext.Provider value={{addMessages,handleInputChanges,isLoading,message}}>

        </ChatContext.Provider>
    )

}