import React from "react";
import type { Metadata } from "next";
import Heading from "@/components/client/heading";
import ServiceCard from "@/components/client/service_card";
import { services } from "@/components/client/services";
import Link from "next/link";

export const dynamic = "force-dynamic";

const metaTitle = `Services | World Pumps`;
const metaDescription =
  "Explore our professional services: swimming pool, filtration, water pumps, irrigation systems, and premium fixtures — installation, maintenance, and support.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
};

export default function ServicesPage() {
  return (
    <main className="px-4 sm:px-[5%] mb-12 mt-8">
      <section className="max-w-7xl mx-auto">
        <Heading
          title="Services"
          summary="Explore World Pumps Services & Facilities"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-12 rounded-md border border-primary/20 p-6 bg-muted/30">
          <h3 className="text-lg font-semibold">Need a custom solution?</h3>
          <p className="text-muted-foreground mt-1">
            Our team can help design, install, and maintain systems tailored to
            your needs. Get in touch to discuss your project.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-4 px-4 py-2 bg-secondary text-white rounded-md"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
