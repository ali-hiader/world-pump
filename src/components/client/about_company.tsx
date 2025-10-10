import React from "react";
import Heading from "./heading";
import Image from "next/image";
import Link from "next/link";

function AboutCompany() {
  return (
    <section className="mt-16 lg:mt-24 md:px-6">
      <Heading
        title="About Us"
        summary="Reliable Pumping Solutions for Every Need"
      />

      <section className="grid md:grid-cols-2 gap-10 mt-8 items-center">
        {/* Left Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Welcome to WORLD PUMPS
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Pakistan’s trusted name in custom swimming pool and luxurious sauna
            room design and construction. We specialize in creating stunning,
            modern pools tailored to your lifestyle—whether it’s a luxurious
            backyard retreat, a commercial pool for hotels and gyms, or a
            compact design for limited spaces.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Beyond recreation, we care about reliable water solutions. Our team
            supplies and installs advanced water filtration systems, durable
            water pumps, and efficient water geysers to keep your home or
            business running smoothly. We also offer fire-fighting systems and
            irrigation solutions to ensure safety and sustainable water
            management.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Let us turn your dream pool into a refreshing reality.
          </p>

          <Link
            href={"/about"}
            aria-label="Learn more about World Pumps"
            className="inline-flex items-center justify-center px-5 py-2 mt-6 text-base rounded-md bg-secondary text-white hover:bg-secondary/90"
          >
            Learn More
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex items-center justify-center px-6">
          <Image
            className="rounded-md w-full h-auto max-h-[500px] shadow-lg object-cover"
            src="/about.jpg"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="World Pumps team installing a water system"
            loading="lazy"
          />
        </div>
      </section>
    </section>
  );
}

export default AboutCompany;
