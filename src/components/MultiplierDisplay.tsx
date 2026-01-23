"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface MultiplierDisplayProps {
  multiplier: number | null;
  isLoading?: boolean;
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

export function MultiplierDisplay({ multiplier, isLoading }: MultiplierDisplayProps) {
  if (isLoading) {
    return (
      <div className="h-[120px] md:h-[160px] flex items-center">
        <div className="h-24 w-48 bg-[var(--border)] animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-[80px] md:text-[120px] lg:text-[160px] font-bold leading-[0.9] tracking-[-0.03em]">
        x{multiplier !== null ? (
          <AnimatedNumber value={multiplier} />
        ) : (
          <span className="text-[var(--dim)]">—</span>
        )}
      </p>
    </motion.div>
  );
}
