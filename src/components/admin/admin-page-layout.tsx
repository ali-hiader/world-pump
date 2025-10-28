import { ReactNode } from 'react'

import { getAdminContainerClasses } from '@/lib/utils'

interface AdminPageLayoutProps {
  children: ReactNode
  className?: string
}

export function AdminPageLayout({ children, className = '' }: AdminPageLayoutProps) {
  return <main className={`${getAdminContainerClasses()} ${className}`}>{children}</main>
}
