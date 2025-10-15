import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { checkAuth } from '@/actions/auth'
import AdminNavBar from '@/components/admin/navbar'

async function AdminLayout({ children }: PropsWithChildren) {
  const ok = await checkAuth()
  if (!ok) redirect('/admin-log-in')

  return (
    <>
      <AdminNavBar />
      {children}
    </>
  )
}

export default AdminLayout
