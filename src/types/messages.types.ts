import {AppRouter} from '@/server'
import {inferRouterOutputs} from '@trpc/server'


type RouterOutput = inferRouterOutputs<AppRouter>
type Message = RouterOutput['getFileMessage']['messages'];

type OmitText = Omit<Message[number],'text'>
type ExtendedText = {
    text:String | JSX.Element
}

export type ExtendedMessage = OmitText & ExtendedText;