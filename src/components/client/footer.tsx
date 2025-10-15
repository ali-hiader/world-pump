import Link from "next/link";

import { Facebook, Mail,Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
        {/* Company Info */}
        <div>
          <Link
            href={"/"}
            className="headingFont text-3xl font-extrabold cursor-pointer"
          >
            World Pumps
          </Link>{" "}
          <p className="text-sm leading-relaxed sm:max-w-3/4 mt-3 text-gray-200">
            Providing reliable water pumps, filtration systems, swimming pool
            solutions, and premium brands to keep your water flowing and
            lifestyle comfortable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Our Services
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Irrigation Systems</li>
            <li>Swimming Pools</li>
            <li>Filtration Systems</li>
            <li>Water Pumps</li>
            <li>Premium Faucets & Fixtures</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white" /> +92 300 1234567
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white" /> info@worldpumps.com
            </li>
            <li className="flex items-center gap-2">
              <Facebook className="w-4 h-4 text-white" />
              <Link
                href="https://facebook.com"
                target="_blank"
                className="hover:text-white"
              >
                Facebook
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} World Pumps. All rights reserved.
      </div>
    </footer>
  );
}
