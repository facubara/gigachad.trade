"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MultiplierDisplayProps {
  multiplier: number | null;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(1, {
    stiffness: 50,
    damping: 20,
  });

  const display = useTransform(spring, (current) => {
    if (current >= 1000) {
      return `${(current / 1000).toFixed(1)}K`;
    }
    if (current >= 100) {
      return current.toFixed(0);
    }
    return current.toFixed(1);
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function MultiplierDisplay({ multiplier }: MultiplierDisplayProps) {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (multiplier !== null && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [multiplier, hasAnimated]);

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter">
          <span className="text-[var(--accent)]">x</span>
          {multiplier !== null ? (
            <AnimatedNumber value={multiplier} />
          ) : (
            <span className="text-[var(--muted)]">—</span>
          )}
        </p>
        <p className="text-xl md:text-2xl text-[var(--muted)] mt-2 uppercase tracking-widest">
          to $1B
        </p>
      </motion.div>
    </div>
  );
}
