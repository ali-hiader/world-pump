import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { clearCart } from '@/actions/cart'

interface SuccessPageProps {
   searchParams: {
      // COD / Bank
      orderId?: string
      method?: string // cod | bank
   }
}

async function SuccessPage({ searchParams }: SuccessPageProps) {
   const session = await auth.api.getSession({ headers: await headers() })
   if (!session) {
      redirect('/sign-in')
   }

   const orderId = searchParams.orderId
   const method = searchParams.method

   let title = 'Order Confirmed!'
   let detail = 'Your new look is on the way'
   const meta: Array<{ label: string; value: string }> = []

   try {
      if (orderId && (method === 'cod' || method === 'bank')) {
         // COD / Bank — order already created; clear cart and show guidance
         await clearCart(session.user.id)
         const isBank = method === 'bank'
         title = isBank ? 'Order placed — Bank Deposit' : 'Order placed — Cash on Delivery'
         detail = isBank
            ? "Please deposit the amount and share the slip via WhatsApp/email as instructed. We'll process your order once funds are verified."
            : 'Your order has been placed. Pay cash to our rider upon delivery.'
         meta.push({ label: 'Order ID', value: orderId })
      }
   } catch (error) {
      logger.error('Success flow error', error)
   }

   return (
      <main className="px-4 sm:px-[5%] w-full flex flex-col items-center mt-16 max-w-[1600px] mx-auto min-h-96">
         <h1 className="relative w-full  text-center headingFont text-4xl md:text-6xl text-gray-900 font-bold">
            {title}
         </h1>
         <p className="text-xl w-full text-center mt-2">{detail}</p>

         {meta.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-3xl w-full">
               {meta.map((m) => (
                  <div key={m.label} className="rounded-md border p-3 text-center">
                     <div className="text-xs text-muted-foreground">{m.label}</div>
                     <div className="font-medium break-all">{m.value}</div>
                  </div>
               ))}
            </div>
         )}

         <Link
            href={'/orders'}
            className="mt-6 bg-secondary hover:bg-secondary/90 px-4 py-2 min-w-72 rounded-full text-center text-white"
         >
            Order Dashboard
         </Link>
      </main>
   )
}

export default SuccessPage
