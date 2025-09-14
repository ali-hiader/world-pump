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
          <h4 className="text-xl font-semibold text-gray-800">
            Welcome to World Pumps
          </h4>
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
            className="py-2 max-w-3/5 mt-10 text-lg rounded-md bg-secondary text-white flex items-center justify-center"
          >
            Learn More
          </Link>
        </div>

        {/* Right Image */}
        <div className="flex items-center justify-center px-6">
          <Image
            className="rounded-md w-full h-auto max-h-[500px] shadow-lg object-cover"
            src="/about.jpg"
            width={500}
            height={500}
            alt="About World Pumps"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutCompany;
