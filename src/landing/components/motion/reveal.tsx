"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  enterOnMount?: boolean;
  scale?: number;
  x?: number | string;
  y?: number | string;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.72,
  enterOnMount = false,
  scale = 1,
  x = 0,
  y = 22,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const visibleState = { opacity: 1, scale: 1, x: 0, y: 0 };

  return (
    <motion.div
      animate={enterOnMount ? visibleState : undefined}
      className={className ? `motion-reveal ${className}` : "motion-reveal"}
      data-motion-reveal=""
      initial={{ opacity: 0, scale, x, y }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0 : duration,
        ease: PREMIUM_EASE,
      }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={enterOnMount ? undefined : visibleState}
    >
      {children}
    </motion.div>
  );
}
