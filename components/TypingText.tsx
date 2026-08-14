"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface TypingTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  /** Delay between characters in ms */
  speed?: number;
  /** Delay before typing starts in ms */
  startDelay?: number;
  /** Show blinking cursor while typing */
  cursor?: boolean;
  /** Keep cursor visible after typing is done */
  cursorAfter?: boolean;
  /** Trigger only once when in viewport */
  once?: boolean;
}

export default function TypingText({
  text,
  tag: Tag = "p",
  className = "",
  speed = 40,
  startDelay = 200,
  cursor = true,
  cursorAfter = false,
  once = true,
}: TypingTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "0px",
  });

  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTimer = setTimeout(() => {
      setTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTyping(false);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [isInView, text, speed, startDelay]);

  const showCursor = cursor && (typing || (cursorAfter && done));

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      <span aria-hidden="true">{displayed}</span>
      {showCursor && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.85em",
            background: "currentColor",
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            animation: typing
              ? "none"
              : "cursor-blink 0.8s step-end infinite",
            opacity: typing ? 1 : undefined,
          }}
        />
      )}
    </Tag>
  );
}
