import React from "react";

interface Props {
  title: string;
  summary?: string;
}

function Heading({ title, summary }: Props) {
  return (
    <>
      <h2 className="text-4xl md:text-5xl font-bold headingFont text-center">
        {title}
      </h2>
      {summary && <p className="md:text-lg text-center mt-1">{summary} </p>}
    </>
  );
}

export default Heading;
