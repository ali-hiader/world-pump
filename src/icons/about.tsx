import React from "react";
import type { SVGProps } from "react";

export default function AboutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={288}
      height={288}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221Z"></path>
        <path strokeLinecap="square" d="M12 12v6m0-11V6"></path>
      </g>
    </svg>
  );
}
