import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

import { auth } from '@/lib/auth/auth'
import SignOutBtn from '@/components/client/sign-out'

async function UserAccountPage() {
   const session = await auth.api.getSession({
      headers: await headers(),
   })

   if (!session) {
      redirect('/sign-in')
   }

   const joinedDate = new Date(session.user.createdAt)

   return (
      <main className="px-4 sm:px-[5%] mt-8 max-w-[1600px] mx-auto min-h-[calc(100vh-115px)] pb-16">
         <hgroup className="flex items-center justify-between">
            <h1 className="relative w-fit headingFont text-4xl md:text-7xl text-gray-900 font-bold">
               Account
            </h1>
            <SignOutBtn />
         </hgroup>

         <section className="flex flex-wrap flex-col gap-4 mt-6 sm:ml-4">
            <hgroup className="flex gap-2 items-center">
               <h3 className="text-lg font-medium ">Name -</h3>
               <p>{session.user.name}</p>
            </hgroup>
            <hgroup className="flex gap-2 items-center">
               <h3 className="text-lg font-medium ">Email -</h3>
               <p>{session.user.email}</p>
            </hgroup>
            <hgroup className="flex gap-2 items-center">
               <h3 className="text-lg font-medium ">Joined On -</h3>
               <p>{`${joinedDate.getDate()}/${joinedDate.getMonth()}/${joinedDate.getFullYear()} `}</p>
            </hgroup>
         </section>

         <Link
            href={'/orders'}
            className="sm:ml-4 px-4 py-2 text-secondary mt-8 inline-block border border-secondary text-lg  "
         >
            Order records
         </Link>
      </main>
   )
}

export default UserAccountPage
