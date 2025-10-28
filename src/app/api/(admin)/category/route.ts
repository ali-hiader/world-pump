import { NextResponse } from 'next/server'

import { categoryTable, db } from '@/db'

// GET: Fetch categories for dropdown
export async function GET() {
  try {
    const categories = await db.select().from(categoryTable)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
