"use client";

import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ScrollParallaxProps = {
  children?: ReactNode;
  className?: string;
  dataAlt?: string;
  fromScale?: number;
  fromY?: number;
  style?: CSSProperties;
  toScale?: number;
  toY?: number;
};

const subscribeToHydration = () => () => {};

export function ScrollParallax({
  children,
  className,
  dataAlt,
  fromScale = 1,
  fromY = 0,
  style,
  toScale = 1,
  toY = 0,
}: ScrollParallaxProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });
  const animatedScale = useTransform(scrollYProgress, [0, 1], [fromScale, toScale]);
  const animatedY = useTransform(scrollYProgress, [0, 1], [fromY, toY]);
  const reduceMotion = hasHydrated && shouldReduceMotion;

  return (
    <motion.div
      className={className}
      data-alt={dataAlt}
      ref={targetRef}
      style={{
        ...style,
        scale: reduceMotion ? fromScale : animatedScale,
        willChange: reduceMotion ? undefined : "transform",
        y: reduceMotion ? fromY : animatedY,
      }}
    >
      {children}
    </motion.div>
  );
}
