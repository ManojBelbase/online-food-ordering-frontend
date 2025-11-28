
"use client"

import { motion } from "framer-motion"

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="relative">
        {/* Magical floating plate with morphing food */}
        <motion.div
          className="relative w-32 h-32 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-2xl border-4 border-orange-100"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Inner plate rim */}
          <div className="absolute inset-2 rounded-full border-2 border-orange-50" />
          
          {/* Morphing food items in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Pizza slice morphing */}
            <motion.div
              className="absolute w-8 h-8"
              animate={{
                rotate: [0, 360],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
                <div className="absolute top-2 right-1 w-1 h-1 bg-green-500 rounded-full" />
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-red-600 rounded-full" />
              </div>
            </motion.div>

            {/* Burger morphing */}
            <motion.div
              className="absolute w-8 h-6"
              animate={{
                rotate: [0, -360],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="relative">
                <div className="w-8 h-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full mb-1" />
                <div className="w-7 h-1 bg-green-500 rounded-full mb-1 ml-0.5" />
                <div className="w-6 h-1 bg-red-500 rounded-full mb-1 ml-1" />
                <div className="w-8 h-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full" />
              </div>
            </motion.div>

            {/* Sushi morphing */}
            <motion.div
              className="absolute w-6 h-6"
              animate={{
                rotate: [0, 360],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-800 relative">
                <div className="absolute inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full" />
              </div>
            </motion.div>

            {/* Taco morphing */}
            <motion.div
              className="absolute w-8 h-4"
              animate={{
                rotate: [0, -360],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            >
              <div className="w-8 h-4 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-b-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-green-400 via-red-400 to-yellow-500 opacity-80" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating food particles around plate */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={`particle-${i}`}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-orange-400' : 
              i % 3 === 1 ? 'bg-green-400' : 
              'bg-red-400'
            }`}
            style={{
              left: `${64 + Math.cos(i * 60 * Math.PI / 180) * 80}px`,
              top: `${64 + Math.sin(i * 60 * Math.PI / 180) * 80}px`
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 1, 0.3],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated chef utensils orbiting */}
        {/* Fork */}
        <motion.div
          className="absolute w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full"
          style={{ top: "-40px", left: "20px" }}
          animate={{
            rotate: [0, 360],
            y: [0, -5, 0]
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="absolute -top-1 left-0 right-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`absolute w-0.5 h-2 bg-gray-400 rounded-full`} style={{left: `${i * 1}px`}} />
            ))}
          </div>
        </motion.div>

        {/* Spoon */}
        <motion.div
          className="absolute w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full"
          style={{ top: "20px", right: "-40px" }}
          animate={{
            rotate: [0, -360],
            x: [0, -5, 0]
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "linear" },
            x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gray-400 rounded-full" />
        </motion.div>

        {/* Knife */}
        <motion.div
          className="absolute w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full"
          style={{ bottom: "-40px", left: "40px" }}
          animate={{
            rotate: [0, 360],
            y: [0, 5, 0]
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-400 rounded-t-full" />
        </motion.div>

        {/* Golden chef sparkles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
            style={{
              top: `${40 + Math.sin(i * 1.5) * 40}px`,
              left: `${60 + Math.cos(i * 1.2) * 60}px`
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}