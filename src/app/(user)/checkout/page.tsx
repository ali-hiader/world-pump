import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { eq, getTableColumns } from 'drizzle-orm'
import { cartTable, productTable } from '@/db/schema'
import { db } from '@/db'
import { auth } from '@/lib/auth/auth'

import Checkout from '@/components/client/checkout'

export const dynamic = 'force-dynamic'

async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  const cartItems = await db
    .select({
      cartId: cartTable.id,
      quantity: cartTable.quantity,
      addedBy: cartTable.createdBy,
      ...getTableColumns(productTable),
    })
    .from(cartTable)
    .innerJoin(productTable, eq(cartTable.productId, productTable.id))
    .where(eq(cartTable.createdBy, session.user.id))

  const payfastEnabled = Boolean(
    process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY,
  )

  console.log(payfastEnabled)

  return (
    <Checkout cartItems={cartItems} userName={session.user.name} payfastEnabled={payfastEnabled} />
  )
}

export default CheckoutPage
