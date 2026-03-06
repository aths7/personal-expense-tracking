import { motion } from 'framer-motion';

export default function ModalAnimation({ children }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                className="w-full max-w-md"
            >
                {children}
            </motion.div>
        </>
    )
}