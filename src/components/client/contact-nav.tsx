import Link from "next/link";

import { FacebookIcon } from "@/icons/facebook";

function ContactNavBar() {
  return (
    <nav aria-label="Contact Nav" className=" bg-primary text-white">
      <section className="mx-auto max-w-[1600px] flex items-center justify-between px-5 sm:px-[3%] py-3 gap-1">
        {/* Left Email Side */}
        <hgroup>
          <h4 className="mr-2 inline-block font-semibold bg-white text-primary rounded px-1 py-0.5">
            Email:
          </h4>
          <Link href="mailto:info@mediaksolutions.com">
            info@worldpumps.com
          </Link>
        </hgroup>

        {/* Right Side Phone & Social */}
        <div className="flex items-center gap-4 lg:mt-0">
          <hgroup className="border-r border-r-white pr-4 md:block hidden">
            <h4 className="font-semibold inline-block">Call:</h4>
            <a href="tel:+923064403039" className="ml-2 hover:underline">
              +92 306 4403039
            </a>
          </hgroup>

          <Link
            href="https://web.facebook.com/WorldPumpspk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FacebookIcon className="size-6" />
          </Link>
        </div>
      </section>
    </nav>
  );
}

export default ContactNavBar;
