import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";

interface LivingCardProps {
  image: string;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  aspectRatio?: "portrait" | "landscape" | "square";
}

export const LivingCard: React.FC<LivingCardProps> = ({
  image,
  title,
  subtitle,
  className,
  onClick,
  aspectRatio = "portrait",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  // Calculate rotation based on mouse position
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Glare effect opacity and position
  const glareOpacity = useTransform(mouseY, [-0.5, 0.5], [0, 0.4]);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    // Normalize mouse position from -0.5 to 0.5 relative to the card center
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const aspectClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative group cursor-pointer", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "w-full h-full rounded-sm overflow-hidden shadow-premium transition-shadow duration-500 group-hover:shadow-premium-hover bg-white",
          aspectClasses[aspectRatio]
        )}
      >
        {/* Card Image using IMG tag for reliability */}
        <img
          src={image}
          alt={title || "Card preview"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Darkening */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Glare Effect */}
        <motion.div
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            pointerEvents: "none",
          }}
          className="absolute inset-0 mix-blend-overlay z-10"
        />

        {/* Content (Title/Subtitle) - Floating slightly above */}
        {(title || subtitle) && (
          <motion.div
            style={{ transform: "translateZ(30px)" }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            {title && (
              <h3 className="text-xl font-bold tracking-wide">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/90 font-medium mt-1 uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
