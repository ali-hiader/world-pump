import type { Metadata } from 'next'

import OrdersPageClient from './orders-page-client'

export const metadata: Metadata = {
   title: 'Orders | World Pumps',
}

export default function OrdersPage() {
   return <OrdersPageClient />
}
