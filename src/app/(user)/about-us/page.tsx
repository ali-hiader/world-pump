import React from "react";
import type { Metadata } from "next";
import Heading from "@/components/client/heading";
import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/client/testimonials";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "World Pumps";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const metadata: Metadata = {
  title: `About Us | ${siteName}`,
  description:
    "World Pumps provides reliable pumping, filtration, irrigation, and pool solutions for homes and businesses across Pakistan.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: `About Us | ${siteName}`,
    description:
      "Learn about our mission, expertise, and the brands we work with.",
    url: baseUrl ? `${baseUrl}/about-us` : undefined,
    siteName,
    type: "website",
  },
};

export default function AboutUsPage() {
  return (
    <main className="px-4 sm:px-[5%] mb-16 mt-8">
      <section className="max-w-7xl mx-auto">
        <Heading
          title="About World Pumps"
          summary="Reliable water solutions for homes, communities, and businesses"
        />

        <div className="grid md:grid-cols-2 gap-10 mt-8 items-center">
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Founded with a simple mission — to keep water flowing where it
              matters most — {siteName} has grown into a trusted provider of
              pumping and water management solutions. From pressure pumps and
              submersibles to filtration systems and pool equipment, we deliver
              products designed for performance and built to last.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our team partners with reputable global brands and combines
              high-quality equipment with dependable installation and after-sales
              support. Whether it’s a single home, a residential building, or a
              commercial facility, we tailor each solution to your needs.
            </p>
            <ul className="grid grid-cols-2 gap-4 text-sm">
              <li className="rounded-md border border-primary/20 p-3">
                <div className="text-2xl font-semibold">10+ years</div>
                <div className="text-muted-foreground">Industry experience</div>
              </li>
              <li className="rounded-md border border-primary/20 p-3">
                <div className="text-2xl font-semibold">25+ cities</div>
                <div className="text-muted-foreground">Service coverage</div>
              </li>
              <li className="rounded-md border border-primary/20 p-3">
                <div className="text-2xl font-semibold">1000+ projects</div>
                <div className="text-muted-foreground">Delivered successfully</div>
              </li>
              <li className="rounded-md border border-primary/20 p-3">
                <div className="text-2xl font-semibold">4.8/5</div>
                <div className="text-muted-foreground">Average rating</div>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-secondary text-white hover:bg-secondary/90"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center px-2 sm:px-6">
            <Image
              className="rounded-md w-full h-auto max-h-[520px] shadow-lg object-cover"
              src="/about.jpg"
              width={1200}
              height={800}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="World Pumps engineers installing a water system"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-16">
        <Heading
          title="What We Do"
          summary="End-to-end support — supply, installation, and maintenance"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Pumping Solutions",
              desc: "Pressure pumps, submersibles, boosters, and industrial systems for reliable flow.",
            },
            {
              title: "Filtration & Treatment",
              desc: "Clean, safe water with premium filtration systems and scheduled maintenance.",
            },
            {
              title: "Pools & Irrigation",
              desc: "Complete pool equipment and efficient irrigation systems for homes and parks.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-md border border-primary/20 bg-muted/30 p-5"
            >
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-16">
        <Testimonials />
      </section>
    </main>
  );
}

