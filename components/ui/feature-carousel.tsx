"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type CarouselFeature = {
  id: string;
  label: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

const AUTO_PLAY_INTERVAL = 3500;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel({ features }: { features: CarouselFeature[] }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % features.length) + features.length) % features.length;

  const nextStep = useCallback(() => setStep((prev) => prev + 1), []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + features.length) % features.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = features.length;
    let normalized = diff;
    if (diff > len / 2) normalized -= len;
    if (diff < -len / 2) normalized += len;
    if (normalized === 0) return "active";
    if (normalized === -1) return "prev";
    if (normalized === 1) return "next";
    return "hidden";
  };

  return (
    <div className="mx-auto w-full max-w-7xl md:p-4">
      <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-border/40 lg:aspect-video lg:flex-row lg:rounded-[3rem]">
        {/* Left — vertical chip reel */}
        <div className="relative z-30 flex min-h-[350px] w-full flex-col items-start justify-center overflow-hidden bg-card px-8 md:min-h-[450px] md:px-16 lg:h-full lg:w-[42%] lg:pl-16">
          <div className="absolute inset-x-0 top-0 z-40 h-12 bg-gradient-to-b from-card via-card/80 to-transparent md:h-20 lg:h-16" />
          <div className="absolute inset-x-0 bottom-0 z-40 h-12 bg-gradient-to-t from-card via-card/80 to-transparent md:h-20 lg:h-16" />
          <div className="relative z-20 flex h-full w-full items-center justify-center lg:justify-start">
            {features.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(features.length / 2),
                features.length / 2,
                distance,
              );
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-full border px-6 py-3.5 text-left transition-all duration-700 md:px-10 md:py-5 lg:px-8 lg:py-4",
                      isActive
                        ? "z-10 border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-foreground/60 hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center transition-colors duration-500",
                        isActive ? "text-primary-foreground" : "text-foreground/40",
                      )}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="whitespace-nowrap font-ui text-sm uppercase tracking-tight md:text-[15px]">
                      {feature.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right — card stack */}
        <div className="relative flex min-h-[500px] flex-1 items-center justify-center overflow-hidden border-t border-border/20 bg-secondary/30 px-6 py-16 md:min-h-[600px] md:px-12 md:py-24 lg:h-full lg:border-l lg:border-t-0 lg:px-10 lg:py-16">
          <div className="relative flex aspect-[4/5] w-full max-w-[420px] items-center justify-center">
            {features.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={feature.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                    rotate: isPrev ? -3 : isNext ? 3 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 origin-center overflow-hidden rounded-[2rem] border-4 border-background bg-background md:rounded-[2.8rem] md:border-8"
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-cover bg-center transition-all duration-700",
                      isActive
                        ? "blur-0 grayscale-0"
                        : "blur-[2px] grayscale brightness-75",
                    )}
                    style={{ backgroundImage: `url(${feature.image})` }}
                  />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 pt-32 md:p-10"
                      >
                        <div className="mb-3 w-fit rounded-full border border-border/50 bg-background px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.2em] text-foreground shadow-lg">
                          {index + 1} • {feature.label}
                        </div>
                        <p className="font-display text-xl leading-tight tracking-tight text-white drop-shadow-md md:text-2xl">
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className={cn(
                      "absolute left-6 top-6 flex items-center gap-3 transition-opacity duration-300 md:left-8 md:top-8",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <span className="size-2 rounded-full bg-primary shadow-[0_0_10px] shadow-primary" />
                    <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/80">
                      areth crate
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
