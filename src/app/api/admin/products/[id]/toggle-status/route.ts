import { NextRequest, NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { checkAuth } from '@/actions/auth'
import { db } from '@/db'
import { productTable } from '@/db/schema'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const prodId = Number(id)
    if (Number.isNaN(prodId)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
    }

    const [existing] = await db.select().from(productTable).where(eq(productTable.id, prodId))
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const current = String(existing.status ?? '').toLowerCase()
    const nextStatus = current === 'active' ? 'inactive' : 'active'

    // perform update and return the updated status (so client can read updated.status)
    const updatedRows = await db
      .update(productTable)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(eq(productTable.id, prodId))
      .returning({ id: productTable.id, status: productTable.status })

    const updated = updatedRows?.[0] ?? null
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status: updated.status, product: updated })
  } catch (err) {
    console.error('toggle-status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
