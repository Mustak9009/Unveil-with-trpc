import React from 'react'
import {cn} from '@/lib/utils'
export  function MaxWidthWrapper({className,children}:{className?:string,children:React.ReactNode}) {
  return (
    <div className={cn('max-w-screen-xl mx-auto w-full px-2.5 md:px-20',className)}>
        {children}
    </div>
  )
}
