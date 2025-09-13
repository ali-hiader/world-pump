import React from "react";
import Heading from "./heading";
import Image from "next/image";

function AboutCompany() {
  return (
    <section className="mt-24 px-6">
      <Heading
        title="About Us"
        summary="Reliable Pumping Solutions for Every Need"
      />

      <div className="grid md:grid-cols-2 gap-10 mt-10 items-center">
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
        </div>

        {/* Right Image */}
        <div className="flex items-center justify-center">
          <Image
            className="rounded-2xl shadow-lg object-contain"
            src="/about.jpg"
            width={300}
            height={600}
            alt="About World Pumps"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutCompany;
