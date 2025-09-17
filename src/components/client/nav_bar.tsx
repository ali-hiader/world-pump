"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth_store";
import PumpsCategories from "./pumps_categories";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathName = usePathname();
  const session = useAuthStore((state) => state.userIdAuthS);
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center py-4 px-4 sm:px-[2%] bg-white shadow-md">
      {/* Logo */}
      <hgroup className="space-y-1">
        <Link
          href={"/"}
          className="headingFont text-2xl sm:text-3xl font-extrabold cursor-pointer"
        >
          World Pumps
        </Link>
      </hgroup>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center justify-between gap-6">
        {navLinks.map((link, index) => (
          <div key={link.href} className="flex items-center gap-6">
            <NavLink href={link.href} pathName={pathName}>
              {link.label}
            </NavLink>
            {index === 0 && <PumpsCategories />} {/* Pumps after Home */}
          </div>
        ))}
      </ul>

      {/* Desktop Right Side */}
      <ul className="hidden md:flex items-center justify-between gap-6 mr-2">
        {session ? (
          <NavLink pathName={pathName} href={"/account"}>
            Account
          </NavLink>
        ) : (
          <NavLink pathName={pathName} href={"/sign-in"}>
            Login
          </NavLink>
        )}
        <NavLink pathName={pathName} href={"/cart"}>
          Cart
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
                  pathName === link.href ||
                  (pathName === "/sign-up" && link.href === "/sign-in");
                return (
                  <div key={link.href}>
                    <li>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block w-full px-4 py-2 rounded-md text-lg ${
                          active
                            ? "bg-secondary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                    {index === 0 && (
                      <div className="mt-2">
                        <PumpsCategories
                          mobile
                          onNavigate={() => setOpen(false)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <li>
                <Link
                  href={session ? "/account" : "/sign-in"}
                  onClick={() => setOpen(false)}
                  className={`block w-full px-4 py-2 rounded-md text-lg ${
                    pathName === (session ? "/account" : "/sign-in")
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {session ? "Account" : "Login"}
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className={`block w-full px-4 py-2 rounded-md text-lg ${
                    pathName === "/cart"
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cart
                </Link>
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      </section>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  pathName: string;
  onClick?: () => void;
}

function NavLink({
  href,
  pathName,
  children,
  onClick,
}: NavLinkProps & PropsWithChildren) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`${
          pathName === href || (pathName === "/sign-up" && href === "/sign-in")
            ? "text-primary font-medium border-b border-b-primary"
            : "text-black"
        } text-lg`}
      >
        {children}
      </Link>
    </li>
  );
}
