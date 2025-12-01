import { PropsWithChildren } from 'react'

import NavBar from '@/components/admin/navbar'

async function AdminLayout({ children }: PropsWithChildren) {
   return (
      <>
         <NavBar />
         {children}
      </>
   )
}

export default AdminLayout
