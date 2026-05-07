'use client'

import { LoaderCircle } from "lucide-react"
import { motion } from "framer-motion"

export const Loading = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <LoaderCircle size={24} className="text-primary" />
            </motion.div>
        </div>
    )
}