import Image from "next/image";
import React from "react";

import Heading from "./heading";

const logos = [
  "/brands/1.png",
  "/brands/2.jpg",
  "/brands/3.jpg",
  "/brands/4.png",
  "/brands/5.jpg",
  "/brands/6.jpg",
];

function Testimonials() {
  return (
    <section className="mt-16 lg:mt-24">
      <Heading
        title="Brands we Deal"
        summary="Partnering with trusted brands to bring you quality and reliability."
      />

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center mt-6">
        {logos.map((logo) => {
          const name = logo.split("/").pop()?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || "Brand";
          return (
            <li key={logo} className="flex items-center justify-center">
              <Image
                src={logo}
                alt={`${name} logo`}
                width={200}
                height={100}
                className="object-contain opacity-90"
                sizes="(max-width: 768px) 50vw, 16vw"
                loading="lazy"
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Testimonials;
