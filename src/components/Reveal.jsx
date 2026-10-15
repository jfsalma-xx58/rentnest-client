import { motion, useReducedMotion } from "framer-motion";

// Fades and slides its children up once, when they scroll into view.
// "delay" lets cards in a row appear one after another.
const Reveal = ({ children, delay = 0, y = 24, className = "" }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;