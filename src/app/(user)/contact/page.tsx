import type { Metadata } from "next";

import React from "react";

import ContactForm from "@/components/client/contact_form";
import Heading from "@/components/client/heading";

export const dynamic = "force-dynamic";

const metaTitle = "Contact | sWorld Pumps";
const metaDescription =
  "Get in touch with World Pumps for inquiries about swimming pools, filtration systems, water pumps, irrigation solutions, and premium fixtures.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
};

export default function ContactPage() {
  return (
    <main className="max-w-[1600px] mx-auto">
      <section className="px-4 sm:px-[5%] mb-12 mt-8 max-w-7xl mx-auto">
        <Heading title="Contact" summary="We’d love to hear from you" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <aside className="space-y-4">
            <div className="rounded-md border border-primary/20 p-4">
              <h3 className="font-semibold">Reach us</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Email: info@worldpumps.com
                <br />
                Phone: +92 306 4403039
              </p>
            </div>
            <div className="rounded-md border border-primary/20 p-4">
              <h3 className="font-semibold">Office Hours</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mon – Sat: 9:00 AM – 6:00 PM
              </p>
            </div>
          </aside>
        </div>

        <div className="w-full h-[480px] mt-16 rounded-md overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.9266120737775!2d74.4284706!3d31.471204899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919066380f46ebd%3A0xb50d6753eb8a188e!2sWorld%20Pumps!5e0!3m2!1sen!2s!4v1757754225661!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </main>
  );
}
