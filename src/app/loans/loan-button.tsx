import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";

export default function LoanAddButton({ text, onClick }: { text?: string, onClick?: () => void }) {
    return (
        <div>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={onClick}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-elegant hover:shadow-elegant-hover transition-all duration-300 hover:-translate-y-0.5 rounded-full font-semibold"
                    size="lg"
                >
                    <motion.div
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                    </motion.div>
                    {text}
                    <Zap className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}