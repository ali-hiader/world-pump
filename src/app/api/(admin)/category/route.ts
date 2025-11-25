import { NextResponse } from 'next/server'

import { logger } from '@/lib/logger'
import { categoryTable, db } from '@/db'

// GET: Fetch categories for dropdown
export async function GET() {
   try {
      const categories = await db.select().from(categoryTable)
      return NextResponse.json({ categories })
   } catch (error) {
      logger.error('Error fetching categories', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
