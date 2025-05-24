// components/AnimatedBubbles.tsx
import { motion } from "framer-motion";

const generateBubbles = (count = 15) => {
  return Array.from({ length: count }).map((_, index) => {
    const size = Math.floor(Math.random() * 40 + 10);
    return (
      <motion.div
        key={index}
        className="absolute rounded-full bg-white/10"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        initial={{ y: 100, scale: 0.5 }}
        animate={{ y: -100, scale: 1.2 }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    );
  });
};

export default function AnimatedBubbles({ count = 50 }: { count?: number }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {generateBubbles(count)}
    </div>
  );
}
