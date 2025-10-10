import { NextResponse } from 'next/server'

import { eq, getTableColumns } from 'drizzle-orm'

import { checkAuth } from '@/actions/auth'
import { db } from '@/db'
import { categoryTable, productTable } from '@/db/schema'

// GET: Fetch all products for admin
export async function GET() {
  try {
    const products = await db
      .select({
        categoryName: categoryTable.name,
        ...getTableColumns(productTable),
      })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .orderBy(productTable.createdAt)
    console.log(products)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await db.delete(productTable).where(eq(productTable.id, Number(productId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
