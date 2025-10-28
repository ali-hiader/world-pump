import { toast } from 'sonner'

interface AlertProps {
   message: string
   description?: string
   variant: 'success' | 'error' | 'warning' | 'info'
   className?: string
}

export function showAlert({ message, description, variant }: AlertProps) {
   if (variant === 'success')
      toast.success(message, {
         description: description,
         style: {
            background: '#d1fae5',
            color: '#065f46',
         },
      })
   if (variant === 'error')
      toast.error(message, {
         description,
         style: {
            background: '#fee2e2',
            color: '#991b1b',
         },
      })
   if (variant === 'warning')
      toast.warning(message, {
         description,
         style: {
            background: '#fefcbf',
            color: '#7e7b2a',
         },
      })
   if (variant === 'info')
      toast.info(message, {
         description,
         style: {
            background: '#bfdbfe',
            color: '#1e3a8a',
         },
      })
}
