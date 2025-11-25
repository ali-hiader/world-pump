import { CopyButton } from '../ui/shadcn-io/copy-button'

interface Props {
   content: string
}

export default function CardItemCopy({ content }: Props) {
   return (
      <div className="flex items-center gap-2">
         <input value={content} readOnly className="flex-1 px-3 py-2 border rounded-md" />
         <CopyButton content={content} />
      </div>
   )
}
