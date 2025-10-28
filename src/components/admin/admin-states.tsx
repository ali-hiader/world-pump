import Link from 'next/link'

import { getAdminCenteredClasses } from '@/lib/utils'
import { AdminPageLayout } from '@/components/admin/admin-page-layout'
import { Button } from '@/components/ui/button'
import Spinner from '@/icons/spinner'

interface AdminLoadingStateProps {
  message?: string
}

export function AdminLoadingState({ message = 'Loading...' }: AdminLoadingStateProps) {
  return (
    <AdminPageLayout>
      <div className={getAdminCenteredClasses()}>
        <Spinner className="animate-spin h-8 w-8 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </AdminPageLayout>
  )
}

interface AdminErrorStateProps {
  error: string
  backLink: string
  backLabel: string
}

export function AdminErrorState({ error, backLink, backLabel }: AdminErrorStateProps) {
  return (
    <AdminPageLayout>
      <div className={getAdminCenteredClasses()}>
        <p className="text-red-600 mb-4">{error}</p>
        <Link href={backLink}>
          <Button>{backLabel}</Button>
        </Link>
      </div>
    </AdminPageLayout>
  )
}

interface AdminNotFoundStateProps {
  message: string
  backLink: string
  backLabel: string
}

export function AdminNotFoundState({ message, backLink, backLabel }: AdminNotFoundStateProps) {
  return (
    <AdminPageLayout>
      <div className={getAdminCenteredClasses()}>
        <p className="text-red-600 mb-4">{message}</p>
        <Link href={backLink}>
          <Button>{backLabel}</Button>
        </Link>
      </div>
    </AdminPageLayout>
  )
}
