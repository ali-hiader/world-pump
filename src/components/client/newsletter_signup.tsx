import React from "react";
import Heading from "./heading";

function Newsletter() {
  return (
    <section className="text-black mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <Heading
          title="Subscribe to our blogs"
          summary="Subscribe for the latest updates on water pumps, pool solutions, and
          exclusive offers."
        />

        <form className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-2/3 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none border border-input focus:border-ring rounded-md"
            required
          />
          <button
            type="button"
            className="bg-secondary text-white font-medium px-6 py-3 rounded-md hover:bg-secondary/80 transition-all"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
