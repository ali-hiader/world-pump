import React, { SVGProps } from "react";

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        stroke="transparent"
        d="M.667 3.167H2.49a2.485 2.485 0 0 0 4.796 0h8.046a.667.667 0 1 0 0-1.333H7.287a2.485 2.485 0 0 0-4.796 0H.667a.667.667 0 1 0 0 1.333Zm4.222-1.833a1.167 1.167 0 1 1 0 2.333 1.167 1.167 0 0 1 0-2.333Z..."
      />
    </svg>
  );
}

export default FilterIcon;
