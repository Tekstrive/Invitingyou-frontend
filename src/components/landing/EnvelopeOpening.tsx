import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/Button";

export const EnvelopeOpening = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Improved animation values with better scroll ranges
  const flapRotation = useTransform(scrollYProgress, [0.2, 0.7], [0, -180]);
  const cardY = useTransform(scrollYProgress, [0.3, 0.8], [100, -150]);
  const cardOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-brand-sand overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#16232A_1px,_transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-mirage mb-6">
            A Moment of Delight
          </h2>
          <p className="text-brand-mirage/70 text-lg max-w-2xl mx-auto">
            Experience the anticipation of a physical invitation, reimagined
            digitally.
          </p>
        </div>

        {/* Envelope Animation Container */}
        <div className="flex justify-center items-center min-h-[600px]">
          <div
            className="relative w-full max-w-md"
            style={{ perspective: "1000px" }}
          >
            {/* Envelope Base */}
            <div className="relative w-full aspect-[4/3] bg-white rounded-lg shadow-2xl border border-neutral-200">
              {/* Envelope Flap */}
              <motion.div
                style={{
                  rotateX: flapRotation,
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                }}
                className="absolute -top-px left-0 right-0 h-1/2 bg-gradient-to-b from-neutral-100 to-white rounded-t-lg border-x border-t border-neutral-200 shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                    <span className="text-brand-orange text-xl font-bold">
                      IO
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Invitation Card */}
              <motion.div
                style={{
                  y: cardY,
                  opacity: cardOpacity,
                }}
                className="absolute inset-4 bg-white rounded-sm shadow-xl border border-brand-orange/20 p-8 flex flex-col items-center justify-center text-center z-10"
              >
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mb-6 border-2 border-brand-orange/30">
                  <span className="text-brand-orange text-3xl font-bold">
                    IO
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-brand-mirage mb-2">
                  You're Invited
                </h3>

                <p className="text-xs uppercase tracking-widest text-brand-mirage/50 mb-6">
                  Saturday, June 25th • 7:00 PM
                </p>

                <p className="text-brand-mirage/70 text-sm mb-8 italic max-w-xs">
                  "Join us for an evening of celebration, laughter, and
                  unforgettable memories."
                </p>

                <Button
                  variant="secondary"
                  size="sm"
                  className="shadow-lg shadow-orange-200/50"
                >
                  RSVP Now
                </Button>
              </motion.div>

              {/* Envelope Bottom Flaps (Visual Detail) */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-neutral-50 border-r border-neutral-200" />
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-neutral-50 border-l border-neutral-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-brand-mirage/60 mb-4">
            Create your own stunning invitations in minutes
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="shadow-xl shadow-orange-200/50"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
};
