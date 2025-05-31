import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          ATS Pro
        </span>
      </motion.div>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xs rounded-full px-3 py-1 font-semibold bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20"
      >
        AI SaaS
      </motion.span>
    </div>
  );
};

export default Logo;
