import { FacebookIcon } from "@/icons/facebook";
import Link from "next/link";
import React from "react";

function ContactNavBar() {
  return (
    <section className="bg-primary text-white px-5 sm:px-[5%] py-3">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Email */}
        <div className="text-center lg:text-left">
          <span className="mr-2 font-semibold bg-white text-primary rounded px-1 py-0.5">
            Email:
          </span>
          <a href="mailto:info@mediaksolutions.com">info@worldpumps.com</a>
        </div>

        {/* Right: Phone & Social */}
        <div className="flex items-center gap-4 lg:mt-0">
          <div className="border-r border-r-white pr-4">
            <span className="font-semibold">Call:</span>
            <a href="tel:+923064403039" className="ml-2 hover:underline">
              +92 306 4403039
            </a>
          </div>

          <Link
            href="https://web.facebook.com/WorldPumpspk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FacebookIcon className="size-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ContactNavBar;
