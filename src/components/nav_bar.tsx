"use client";

import { SVGProps, JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AboutIcon from "@/icons/about";
import CartIcon from "@/icons/cart";
import { HomeIcon } from "@/icons/home";
import { LoginIcon } from "@/icons/log_in";
import UserIcon from "@/icons/user";
import { useAuthStore } from "@/stores/auth_store";

const navLinks = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/about-us", icon: AboutIcon, label: "About" },
];

const signUpLinks = [{ href: "/sign-in", icon: LoginIcon, label: "Log In" }];

const signedUpLinks = [
  { href: "/account", icon: UserIcon, label: "Account" },
  { href: "/cart", icon: CartIcon, label: "Cart" },
];

export default function NavBar() {
  const pathName = usePathname();
  const session = useAuthStore((state) => state.userIdAuthS);
  const renderLink = (link: {
    href: string;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    label: string;
  }) => {
    const active = pathName === link.href;
    return (
      <Link
        href={link.href}
        key={link.href}
        className={`${
          active || (pathName === "/sign-up" && link.href === "/sign-in")
            ? "bg-primary/15"
            : "bg-primary/5 hover:bg-primary/10"
        } flex justify-between items-center px-3 py-2 rounded-full `}
      >
        <p className="flex items-center gap-3">
          <link.icon
            className={`${active || (pathName === "/sign-up" && link.href === "/sign-in") ? "text-primary" : "text-gray-700"} size-6`}
          />
          <span
            className={`${
              active || (pathName === "/sign-up" && link.href === "/sign-in")
                ? "text-primary"
                : "text-gray-700"
            } font-medium`}
          >
            {link.label}
          </span>
        </p>
        {active && (
          <span className="bg-primary/80 text-white ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px]">
            Current
          </span>
        )}
      </Link>
    );
  };

  return (
    <nav
      key={session ? "signed-in" : "signed-out"}
      className="flex justify-between items-start mt-10 mb-20 px-4 sm:px-[5%]"
    >
      {/* Logo + Title */}
      <hgroup className="space-y-1">
        <Link
          href={"/"}
          className="headingFont text-4xl font-extrabold cursor-pointer"
        >
          linea
        </Link>
        <p className="text-gray-600">Timeless / Elegant</p>
      </hgroup>

      {/* Desktop Nav */}
      <ul className="hidden bg-primary text-white md:flex items-center justify-between gap-6 px-8 py-4 rounded-full">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <link.icon
                className={`${
                  pathName === link.href ? "text-secondary " : "text-white "
                } size-8`}
              />
            </Link>
          </li>
        ))}

        {!session &&
          signUpLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <link.icon
                  className={`${
                    pathName === link.href ||
                    (pathName === "/sign-up" && link.href === "/sign-in")
                      ? "text-secondary "
                      : "text-white "
                  } size-8`}
                />
              </Link>
            </li>
          ))}

        {session &&
          signedUpLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <link.icon
                  className={`${
                    pathName === link.href ? "text-secondary " : "text-white "
                  } size-8`}
                />
              </Link>
            </li>
          ))}
      </ul>

      {/* Mobile Nav (Dialog) */}
      <section className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative cursor-pointer" aria-label="Open menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 18 18"
                className="text-black dark:text-white"
              >
                <path
                  fill="currentColor"
                  d="M17.25 8.25H.75a.75.75 0 1 0 0 1.5h16.5a.75.75 0 0 0 0-1.5ZM17.25 3H.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5ZM17.25 13.5H.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5Z"
                />
              </svg>
            </button>
          </DialogTrigger>
          <DialogContent className="p-6 rounded-md outline-2 outline-primary">
            <DialogHeader>
              <DialogTitle className="text-sm text-start">
                Navigation
              </DialogTitle>
            </DialogHeader>
            <ul className="flex flex-col gap-2 mt-6">
              {navLinks.map(renderLink)}
              {!session && signUpLinks.map(renderLink)}
              {session && signedUpLinks.map(renderLink)}
            </ul>
          </DialogContent>
        </Dialog>
      </section>
    </nav>
  );
}
