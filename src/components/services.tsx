import React from "react";
import Heading from "./heading";
import ServiceCard from "./service_card";

export const services = [
  {
    image: "/swimming_pool.jpg",
    title: "Swimming Pool",
    description:
      "Expert pool construction, maintenance, and repair for homes and businesses keeping your pool safe, clean, and ready to enjoy.",
  },
  {
    image: "/filtration_system.avif",
    title: "Filtration System",
    description:
      "Reliable installation and maintenance of filtration systems to ensure clean and safe water for your pool or home.",
  },
  {
    image: "/water_pumps_services.webp",
    title: "Water Pumps",
    description:
      "Supply, installation, and maintenance of high-performance water pumps for efficient water flow and pressure.",
  },
  {
    image: "/irrigation_system.png",
    title: "Irrigation System",
    description:
      "Design and install efficient irrigation systems for lawns, gardens, and landscapes saving water while keeping greenery healthy.",
  },
  {
    image: "/fiore.jpg",
    title: "Fiore, Kariba & Other Premium Brands",
    description:
      "Quality faucets and ceramic fixtures for kitchens and bathrooms stylish, durable, and functional.",
  },
];

function Services() {
  return (
    <section className="mt-24">
      <Heading
        title="Services"
        summary="Explore World Pumps Services & Facilities"
      />

      <div className="grid grid-cols-2 gap-6 mt-8">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
}

export default Services;
