import { motion } from "framer-motion";
import config from "@/lib/config.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      className="component-container mt-auto"
      style={{
        borderRadius: 0,
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        display: "flex",
        justifyContent: "center"
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span> &copy; {currentYear} &nbsp; | &nbsp; {config.project.name} </span>
      </div>
    </motion.footer>
  );
}
