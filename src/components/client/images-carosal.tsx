"use client";

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
    <Carousel className="w-full">
      <CarouselContent>
        {carosalImages.map((image) => (
          <CarouselItem key={image} className="overflow-hidden">
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
              <Image
                src={image}
                alt="Carousel Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

export default ImagesCarosal;
