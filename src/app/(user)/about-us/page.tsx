import React from "react";

function AboutUsPage() {
  return (
    <main className="px-4 sm:px-[5%]">
      <h1 className="relative w-fit headingFont text-4xl md:text-7xl text-gray-900 font-bold">
        About Us
      </h1>
      <p className="mt-6 text-gray-700 text-lg leading-relaxed">
        I’m{" "}
        <span className="text-2xl font-extrabold text-primary headingFont">
          Muhammad Ali Haider
        </span>{" "}
        -{" "}
        <span className="text-lg italic font-medium text-indigo-600 whitespace-nowrap">
          Full-Stack Web Developer
        </span>
        .
      </p>

      <p className="mt-6 max-w-3xl leading-relaxed text-gray-700 text-lg">
        <span className="text-3xl font-bold text-gray-900 headingFont">
          linea
        </span>{" "}
        is one of my practice projects created to sharpen my development skills.
        The landing page design and images are inspired by
        <span className="font-semibold text-gray-900"> Eton</span>, but the
        implementation is built completely from scratch. It uses{" "}
        <span className="font-semibold text-indigo-600">Next.js</span> for the
        application framework,{" "}
        <span className="font-semibold text-emerald-600">Neon</span> with{" "}
        <span className="font-semibold text-purple-600">Drizzle ORM</span> for
        database management, and{" "}
        <span className="font-semibold text-pink-600">Better-Auth</span> for
        secure authentication. You can explore more of my projects at my{" "}
        <a
          href="https://alihaider.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-sky-500 hover:text-sky-600 transition-colors"
        >
          Portfolio
        </a>
        .
      </p>
    </main>
  );
}

export default AboutUsPage;
