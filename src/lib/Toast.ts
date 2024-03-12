import { toast } from "@/components/ui/use-toast";
type VariantType = "default" | "destructive" | null | undefined
export function ShowToast({title,description,action,variant='default'}:{title:string,description:string,action:JSX.Element,variant:VariantType}){
  return  toast({
    title,
    description,
    variant,
    action
  })
}