"use client";

import { useState } from "react";

const SizeSelector = () => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const [selectedSize, setSelectedSize] = useState("L");

  return (
    <div className="mt-8">
      <label className="font-medium">Size</label>
      <ul className="flex items-center gap-2 mt-2">
        {sizes.map((size, index) => (
          <li
            key={index}
            className={`size-10 flex items-center justify-center rounded-full border text-sm cursor-pointer ${selectedSize === size ? "border-primary" : "border-secondary-foreground shadow"}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SizeSelector;
