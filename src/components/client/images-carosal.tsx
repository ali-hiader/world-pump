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
        {carosalImages.map((image, idx) => {
          const filename = image.split("/").pop() || "slide";
          const isFirst = idx === 0;
          const blur = toBase64(shimmer(1200, 600));
          return (
            <CarouselItem key={image} className="overflow-hidden">
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                <Image
                  src={image}
                  alt={`Hero slide: ${filename.replace(/[-_]/g, " ")}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={isFirst}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : undefined}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${blur}`}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}

export default ImagesCarosal;

// Lightweight shimmer placeholder for better perceived loading
function shimmer(w: number, h: number) {
  return `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f3f4f6" offset="20%" />
        <stop stop-color="#e5e7eb" offset="50%" />
        <stop stop-color="#f3f4f6" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#f3f4f6" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
  </svg>`;
}

function toBase64(str: string) {
  if (typeof window === "undefined") {
    return Buffer.from(str).toString("base64");
  }
  return window.btoa(str);
}
