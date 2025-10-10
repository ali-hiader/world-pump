import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth/auth'
import { db } from '@/db'
import { orderItemTable, orderTable } from '@/db/schema'

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db
      .select()
      .from(orderTable)
      .where(eq(orderTable.userEmail, session.user.email))

    const orderItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItemTable)
          .where(eq(orderItemTable.orderId, order.id))
        return {
          order,
          items,
        }
      }),
    )

    return NextResponse.json({ orderItems })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
