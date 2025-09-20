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

      <div className="grid md:grid-cols-2 gap-10 mt-8 items-center">
        {/* Left Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Welcome to World Pumps
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We are your trusted partner in water pump solutions, providing
            reliable products and professional services tailored to meet both
            residential and commercial needs.
          </p>
          <p className="text-gray-600 leading-relaxed">
            With years of expertise, our offerings include high-efficiency
            pressure pumps, advanced water filtration systems, swimming pool
            accessories, and modern geysers. Our commitment is to deliver
            long-lasting performance and customer satisfaction with every
            solution we provide.
          </p>
          <p className="text-gray-600 leading-relaxed">
            At World Pumps, we don’t just sell products — we build trust,
            ensuring your water systems remain strong, efficient, and
            worry-free.
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
      </div>
    </section>
  );
}

export default AboutCompany;

