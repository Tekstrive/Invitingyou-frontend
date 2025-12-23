import { motion } from "framer-motion";

export const EmotionalBenefits = () => {
  return (
    <section className="py-32 bg-brand-mirage text-brand-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-8">
                More than just an invite.
                <br />
                <span className="text-brand-orange italic">
                  It's the start of a memory.
                </span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                In a world of digital noise, a thoughtful invitation stands out.
                It signals that this moment matters. That these people matter.
                InvitingYou helps you craft that first impression with elegance
                and ease.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                From the tactile feel of our digital envelopes to the carefully
                curated typography, every detail is designed to honor your
                celebration.
              </p>
            </motion.div>
          </div>

          {/* Visual Collage */}
          <div className="order-1 md:order-2 relative h-[600px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute top-0 right-0 w-3/4 h-3/4 bg-cover bg-center rounded-sm shadow-2xl z-10"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80')",
              }}
            />
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-brand-sage/20 backdrop-blur-sm rounded-sm z-20 p-8 flex items-end border border-white/10"
            >
              <p className="text-2xl italic text-white">
                "The laughter, the toasts, the joy—it all begins with 'You are
                invited'."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
