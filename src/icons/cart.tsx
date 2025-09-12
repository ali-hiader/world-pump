import React from "react";
import type { SVGProps } from "react";

export default function CratIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={288}
      height={288}
      viewBox="0 0 256 256"
      {...props}
    >
      <g fill="none" strokeWidth={18}>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 64,80 h 128 c 16,0 29.33333,16 32,32 l 16,96 c 2.66807,16.00842 -16,32 -32,32 H 48 C 32,240 13.33193,224.00842 16,208 L 32,112 C 34.666667,96 48,80 64,80 Z"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 80,112 V 63.814079"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m 176,64 v 48"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 19.090159,191.31828 H 236.90984"
        ></path>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M 176,64 C 176,48 166.70076,30.94703 151.90703,22.405869 137.1133,13.86471 118.88668,13.86471 104.09296,22.40587 89.299233,30.947031 80.000002,48 80,64"
        ></path>
        <rect width={80} height={16} x={16} y={240}></rect>
      </g>
    </svg>
  );
}
