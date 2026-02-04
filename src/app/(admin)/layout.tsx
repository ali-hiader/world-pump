'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import {
   LayoutDashboard,
   LogOut,
   Menu,
   Package,
   PackageOpen,
   PlusCircle,
   ShoppingCart,
   Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
   { href: '/super-admin', name: 'Dashboard', icon: LayoutDashboard },
   { href: '/super-admin/products', name: 'Products', icon: Package },
   { href: '/super-admin/accessories', name: 'Accessories', icon: PackageOpen },
   { href: '/super-admin/orders', name: 'Orders', icon: ShoppingCart },
   { href: '/super-admin/users', name: 'Users', icon: Users },
   { href: '/super-admin/products/add', name: 'Add Product', icon: PlusCircle },
   { href: '/super-admin/accessories/add', name: 'Add Accessory', icon: PlusCircle },
   { href: '/', name: 'Logout', icon: LogOut },
]

interface Props {
   children: React.ReactNode
}

function SuperAdminLayout({ children }: Props) {
   const pathname = usePathname()

   const isActive = (href: string, currentPath?: string | null) => {
      if (!currentPath) return false
      if (currentPath === href) return true
      if (href === '/') return false

      if (href === '/super-admin/products') {
         return (
            currentPath.startsWith('/super-admin/products') &&
            currentPath !== '/super-admin/products/add'
         )
      }

      if (href === '/super-admin/accessories') {
         return (
            currentPath.startsWith('/super-admin/accessories') &&
            currentPath !== '/super-admin/accessories/add'
         )
      }

      return currentPath.startsWith(href) && href !== '/super-admin'
   }

   return (
      <div className="bg-background min-h-screen">
         {/* Top Navigation */}
         <header className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex h-14 w-full items-center gap-4 border-b px-4 backdrop-blur-sm">
            <DropdownMenu>
               <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">Open menu</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-52">
                  {navigation.map((item) => {
                     const Icon = item.icon
                     return (
                        <DropdownMenuItem key={item.name} asChild>
                           <Link
                              href={item.href}
                              className="flex cursor-pointer items-center gap-2"
                           >
                              <Icon className="h-4 w-4" />
                              {item.name}
                           </Link>
                        </DropdownMenuItem>
                     )
                  })}
               </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex flex-1 items-center justify-between">
               <Link href="/super-admin" className="font-semibold">
                  Worlds Pump Admin Dashboard
               </Link>
            </div>
         </header>

         <div className="flex">
            {/* Side Navigation - Desktop Only */}
            <aside className="border-border/40 bg-background sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 self-start border-r md:block">
               <nav className="space-y-1 p-4">
                  {navigation.map((item) => {
                     const Icon = item.icon
                     return (
                        <Link
                           key={item.name}
                           href={item.href}
                           className={cn(
                              'group hover:bg-primary hover:text-background flex items-center rounded-md px-3 py-2 text-sm font-medium',
                              'transition-colors',
                              isActive(item.href, pathname) ? 'bg-primary text-background' : '',
                           )}
                        >
                           <Icon className="mr-3 h-5 w-5" />
                           <span>{item.name}</span>
                        </Link>
                     )
                  })}
               </nav>
            </aside>

            {/* Main Content */}
            <main className="w-full flex-1">
               <div className="px-4 py-6">{children}</div>
            </main>
         </div>
      </div>
   )
}

export default SuperAdminLayout
