import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { getAdminSession } from '@/lib/auth/admin-auth'
import AdminNavBar from '@/components/admin/navbar'

async function AdminLayout({ children }: PropsWithChildren) {
   const ok = await getAdminSession()
   if (!ok) redirect('/admin-log-in')

   return (
      <>
         <AdminNavBar />
         {children}
      </>
   )
}

export default AdminLayout
