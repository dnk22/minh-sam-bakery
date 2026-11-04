"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  itemClassNames?: string[];
  scale?: number;
  stagger?: number;
  x?: number | string;
  y?: number | string;
};

export function StaggerReveal({
  children,
  className,
  delay = 0,
  itemClassNames = [],
  scale = 0.985,
  stagger = 0.065,
  x = 0,
  y = 22,
}: StaggerRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: shouldReduceMotion ? 0 : delay,
            staggerChildren: shouldReduceMotion ? 0 : stagger,
          },
        },
      }}
      viewport={{ amount: 0.12, once: true }}
      whileInView="visible"
    >
      {items.map((item, index) => (
        <motion.div
          className={itemClassNames[index] ? `motion-reveal ${itemClassNames[index]}` : "motion-reveal"}
          data-motion-reveal=""
          key={index}
          variants={{
            hidden: { opacity: 0, scale, x, y },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: shouldReduceMotion ? 0 : 0.7, ease: PREMIUM_EASE },
              x: 0,
              y: 0,
            },
          }}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
