'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useState } from 'react'

import { CategoryType } from '@/lib/types'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/auth_store'
import useCartStore from '@/stores/cart_store'
import useProductsStore from '@/stores/pump_store'

import { Badge } from '../ui/badge'

import PumpsCategories from './pumps_categories'

const navLinks = [
   { href: '/', label: 'Home' },
   { href: '/services', label: 'Services' },
   { href: '/about-us', label: 'About' },
   { href: '/contact', label: 'Contact' },
   { href: '/blogs', label: 'Blog' },
]

export default function NavBar({ categories }: { categories?: CategoryType[] }) {
   const pathName = usePathname()
   const [open, setOpen] = useState(false)
   const { setCategories } = useProductsStore()

   const session = useAuthStore((state) => state.userIdAuthS)
   const { getTotalItems } = useCartStore()

   const totalItems = session ? getTotalItems(session) : 0

   useEffect(() => {
      if (categories && categories.length > 0) {
         setCategories(categories)
      }
   }, [categories, setCategories])

   return (
      <nav aria-label="Main Nav" className="sticky top-0 z-50 bg-white shadow-md">
         <section className="max-w-[1600px] mx-auto flex justify-between items-center p-4 sm:px-[2%] ">
            {/* Logo */}
            <Link
               href={'/'}
               className="headingFont text-2xl sm:text-3xl font-extrabold cursor-pointer"
            >
               World Pumps
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-6">
               {navLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                     <NavLink href={link.href} pathName={pathName}>
                        {link.label}
                     </NavLink>
                     {index === 0 && (
                        <li key="pumps-menu">
                           <PumpsCategories />
                        </li>
                     )}
                  </React.Fragment>
               ))}
            </ul>

            {/* Desktop Right Side */}
            <ul className="hidden md:flex items-center justify-between gap-6 mr-2">
               {session ? (
                  <NavLink pathName={pathName} href={'/account'}>
                     Account
                  </NavLink>
               ) : (
                  <NavLink pathName={pathName} href={'/sign-in'}>
                     Login
                  </NavLink>
               )}
               <NavLink pathName={pathName} href={'/cart'}>
                  Cart
                  {totalItems > 0 && (
                     <Badge className="absolute size-5 top-3 right-4 bg-secondary rounded-full text-white">
                        {totalItems}
                     </Badge>
                  )}
               </NavLink>
            </ul>

            <section className="md:hidden">
               <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                     <button className="relative cursor-pointer" aria-label="Open menu">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="22"
                           height="22"
                           fill="none"
                           viewBox="0 0 18 18"
                           className="text-black"
                        >
                           <path
                              fill="currentColor"
                              d="M17.25 8.25H.75a.75.75 0 1 0 0 1.5h16.5a.75.75 0 0 0 0-1.5ZM17.25 3H.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5ZM17.25 13.5H.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5Z"
                           />
                        </svg>
                     </button>
                  </DialogTrigger>
                  <DialogContent className="p-6 rounded-md outline-none">
                     <DialogHeader>
                        <DialogTitle className="text-sm text-start font-normal">
                           Navigation
                        </DialogTitle>
                     </DialogHeader>

                     <ul className="flex flex-col gap-2 mt-2">
                        {navLinks.map((link, index) => {
                           const active =
                              pathName.startsWith(link.href) ||
                              (pathName === '/sign-up' && link.href === '/sign-in')

                           return (
                              <React.Fragment key={link.href}>
                                 <li>
                                    <Link
                                       href={link.href}
                                       onClick={() => setOpen(false)}
                                       className={`block w-full px-4 py-2 rounded-md text-lg ${
                                          active
                                             ? 'bg-secondary text-white'
                                             : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                       }`}
                                    >
                                       {link.label}
                                    </Link>
                                 </li>
                                 {index === 0 && (
                                    <li key="pumps-mobile" className="mt-2 list-none">
                                       <PumpsCategories mobile onNavigate={() => setOpen(false)} />
                                    </li>
                                 )}
                              </React.Fragment>
                           )
                        })}

                        <li>
                           <Link
                              href={session ? '/account' : '/sign-in'}
                              onClick={() => setOpen(false)}
                              className={`block w-full px-4 py-2 rounded-md text-lg ${
                                 pathName === (session ? '/account' : '/sign-in')
                                    ? 'bg-secondary text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              }`}
                           >
                              {session ? 'Account' : 'Login'}
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/cart"
                              onClick={() => setOpen(false)}
                              className={`block w-full px-4 py-2 rounded-md text-lg ${
                                 pathName === '/cart'
                                    ? 'bg-secondary text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              }`}
                           >
                              Cart
                           </Link>
                        </li>
                     </ul>
                  </DialogContent>
               </Dialog>
            </section>
         </section>
      </nav>
   )
}

interface NavLinkProps {
   href: string
   pathName: string
   onClick?: () => void
}

function NavLink({ href, pathName, children, onClick }: NavLinkProps & PropsWithChildren) {
   const isActive = pathName === href || (pathName === '/sign-up' && href === '/sign-in')
   return (
      <li>
         <Link
            href={href}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={`${
               isActive ? 'text-primary font-medium border-b border-b-primary' : 'text-black'
            } text-lg`}
         >
            {children}
         </Link>
      </li>
   )
}
