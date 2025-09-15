import React from "react";
import Heading from "./heading";
import Image from "next/image";

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

      <div className="grid grid-cols-3 sm:flex sm:flex-nowrap gap-4 items-center mt-6">
        {logos.map((logo) => (
          <div key={logo}>
            <Image src={logo} alt="Comapny's logo" width={200} height={100} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
