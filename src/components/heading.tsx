import React from "react";

interface Props {
  title: string;
  itemsOnPage: number;
}

function Heading({ title, itemsOnPage }: Props) {
  return (
    <h1 className="relative w-fit headingFont text-4xl md:text-7xl text-gray-900 font-bold">
      {title}
      <span className="absolute top-0 right-0 text-2xl translate-x-5 -translate-y-2">
        {itemsOnPage}
      </span>
    </h1>
  );
}

export default Heading;
