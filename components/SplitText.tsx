"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "motion/react";

type SplitBy = "words" | "chars";

interface SplitTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  splitBy?: SplitBy;
  stagger?: number;
  duration?: number;
  from?: { y?: number; x?: number; opacity?: number; rotate?: number };
  rootMargin?: string;
  once?: boolean;
}

export default function SplitText({
  text,
  tag: Tag = "p",
  className = "",
  splitBy = "words",
  stagger = 0.04,
  duration = 0.7,
  from = { y: 40, opacity: 0 },
  rootMargin = "-80px",
  once = true,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: rootMargin as `${number}px ${number}px ${number}px ${number}px`,
  });

  const tokens: string[] =
    splitBy === "chars"
      ? text.split("")
      : text.split(/(\s+)/);

  const itemVariants: Variants = {
    hidden: {
      y: from.y ?? 0,
      x: from.x ?? 0,
      opacity: from.opacity ?? 1,
      rotate: from.rotate ?? 0,
    },
    visible: (i: number) => ({
      y: 0,
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        duration,
        delay: i * stagger,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const wrapStyle: React.CSSProperties = {
    overflow: "hidden",
    display: "inline-block",
    verticalAlign: "bottom",
  };

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={i} aria-hidden="true">{token}</span>;
        }
        return (
          <span key={i} style={wrapStyle} aria-hidden="true">
            <motion.span
              style={{ display: "inline-block" }}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
