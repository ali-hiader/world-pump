import Link from "next/link";
import React from "react";

function ContactNavBar() {
  return (
    <header className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row items-center justify-between">
        {/* Left: Email */}
        <div className="text-center lg:text-left">
          <span className="mr-2 font-semibold">Email:</span>
          <a href="mailto:info@mediaksolutions.com" className="hover:underline">
            info@worldpumps.com
          </a>
        </div>

        {/* Right: Phone & Social */}
        <nav className="flex items-center space-x-6 mt-2 lg:mt-0">
          <div>
            <span className="font-semibold">Call:</span>
            <a href="tel:+923008467101" className="ml-2 hover:underline">
              +92 300 8467101
            </a>
          </div>

          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-xl hover:text-gray-300"></i>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default ContactNavBar;
