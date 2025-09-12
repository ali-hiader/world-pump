"use client";

import { useState } from "react";
import Heading from "./heading";
import useShirtStore from "@/stores/shirt_store";
import { Product } from "@/lib/types";

const filters = ["All", "Pointed Collar", "Cut Away Collar"];

interface Props {
  initialShirts: Product[];
}

export default function Hero({ initialShirts }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const { shirts, setShirts } = useShirtStore();

  function changeFilter(filter: string) {
    setSelectedFilter(filter);
    setShirts(initialShirts.filter((shirt) => shirt.category !== filter));
  }

  return (
    <header className="mb-7 lg:mb-11 px-4 sm:px-[5%]">
      <Heading title="Shirts Collection" itemsOnPage={shirts.length} />
      {/* Description */}
      <div className="mt-6 prose prose-sm light:prose-light sm:prose lg:prose-lg xl:prose-xl light:[&_a]:prose-light prose-h1:mb-4 prose-h1:text-5xl prose-h2:mb-4 prose-h2:text-4xl prose-h3:font-neutraface prose-h3:text-3xl max-w-3xl">
        <div className=" text-xl leading-8 transition-all duration-500 overflow-hidden line-clamp-3 max-h-48 lg:max-h-32">
          <p>
            Discover our curated selection of premium shirts designed for every
            occasion. From crisp dress shirts to relaxed casual styles, each
            piece is crafted with attention to detail and timeless style.
          </p>
        </div>
      </div>
      <div className="mb-7 mt-14 flex flex-col gap-7 lg:mb-11">
        {/* Left Section: Filters */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`${
            !showFilter ? "bg-primary text-white" : "bg-transparent"
          } shrink-0 h-10 min-w-max border border-primary items-center justify-center rounded-full px-6 inline-flex cursor-pointer font-medium uppercase transition-all sm:hidden`}
        >
          Filters
        </button>

        <div
          className={`${showFilter ? "hidden sm:flex" : "flex"} gap-2 overflow-x-auto sm:flex-row flex-col lg:flex-wrap lg:px-0 transition-all`}
        >
          {filters.map((filter) => (
            <button
              onClick={() => changeFilter(filter)}
              key={filter}
              className={`${
                selectedFilter === filter
                  ? "bg-secondary text-white"
                  : "bg-secondary-foreground"
              } shrink-0 h-10 min-w-max items-center justify-center rounded-full px-6 inline-flex cursor-pointer transition-all`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
