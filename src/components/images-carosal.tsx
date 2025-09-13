import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { carosalImages } from "@/lib/utils";
import Image from "next/image";

function ImagesCarosal() {
  return (
    <Carousel className="h-[450px]">
      <CarouselContent>
        {carosalImages.map((image) => (
          <CarouselItem key={image} className="overflow-hidden">
            <Image
              className="w-full h-auto object-cover"
              width={1000}
              height={450}
              src={image}
              alt=""
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ImagesCarosal;
