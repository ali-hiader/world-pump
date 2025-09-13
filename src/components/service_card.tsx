import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  description: string;
  image: string;
}

function ServiceCard({ title, description, image }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 shadow px-4 py-4 rounded-md">
      <div>
        <Image
          className="rounded-md object-contain"
          src={image}
          alt={title}
          width={500}
          height={300}
        />
      </div>
      <div className="col-span-2 flex flex-col justify-center gap-2">
        <h3 className="text-lg font-medium">{title}</h3>
        <p>{description}</p>
        <Link
          href={"/contact"}
          className="px-4 py-2 mt-4 bg-secondary text-white w-fit rounded-md"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;
