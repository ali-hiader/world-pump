import { Textarea } from '@/components/ui/textarea'

export interface CustomTextareaProps {
   name: string
   required?: boolean
   placeholder?: string
   value?: string
   onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
   defaultValue?: string
   rows?: number
}

export default function CustomTextarea({
   name,
   required = false,
   placeholder = 'Enter text...',
   value,
   onChange,
   defaultValue,
   rows = 1,
}: CustomTextareaProps) {
   // Use controlled if value and onChange are provided, otherwise uncontrolled
   const isControlled = value !== undefined && onChange !== undefined

   return (
      <div className="w-full">
         <Textarea
            id={name}
            name={name}
            required={required}
            placeholder={placeholder}
            rows={rows}
            className="w-full border-0 border-b transition-all border-input p-0 h-fit
                 rounded-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-b-primary 
                 border-b-ring text-sm placeholder:text-muted-foreground hover:border-b-2 hover:border-b-black resize-none"
            {...(isControlled
               ? { value: value, onChange: onChange }
               : { defaultValue: defaultValue })}
         />
      </div>
   )
}
