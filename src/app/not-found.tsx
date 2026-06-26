"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground overflow-hidden">
      
      {/* Floating Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="relative flex h-full w-full flex-col items-center justify-center px-6">
        
        {/* Animated Interaction Container */}
        <div className="relative flex flex-col items-center justify-center mt-8">
          
          {/* Giant 404 Text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="text-[10rem] sm:text-[14rem] md:text-[20rem] font-black leading-none tracking-tighter text-foreground/15 select-none z-0"
          >
            404
          </motion.div>

          {/* Floating Bouncy T-Shirt SVG */}
          <motion.div
            initial={{ y: -100, rotate: -15, opacity: 0 }}
            animate={{ 
              y: [-20, 10, -20], 
              rotate: [-5, 5, -5],
              opacity: 1
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
            className="absolute z-10 h-56 w-56 sm:h-72 sm:w-72 md:h-[350px] md:w-[350px]"
          >
            {/* Custom SVG Ghost/Torn Tee */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
              <path d="M60 40 L140 40 L170 80 L140 90 L140 160 C130 150 120 170 100 160 C80 170 70 150 60 160 L60 90 L30 80 Z" 
                    fill="currentColor" 
                    className="text-primary"
                    stroke="currentColor" 
                    strokeWidth="8" 
                    strokeLinejoin="round" />
              {/* Eyes for Disney magic */}
              <circle cx="85" cy="85" r="8" fill="var(--bg)" />
              <circle cx="115" cy="85" r="8" fill="var(--bg)" />
              <path d="M90 105 Q100 115 110 105" stroke="var(--bg)" strokeWidth="4" strokeLinecap="round" />
              {/* Magical sparkles */}
              <path d="M150 30 L155 45 L170 50 L155 55 L150 70 L145 55 L130 50 L145 45 Z" fill="#FDE047" />
              <path d="M40 120 L43 130 L53 133 L43 136 L40 146 L37 136 L27 133 L37 130 Z" fill="#FDE047" />
            </svg>
          </motion.div>

        </div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="z-20 max-w-md text-center space-y-4"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            This page is not part of the collection.
          </h1>
          <p className="text-base text-muted-foreground">
            It looks like this piece is missing from the drop. It may have been moved or never existed.
          </p>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="z-20 mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-md sm:flex-row sm:justify-center"
        >
          <Link
            href="/shop"
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-foreground px-6 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Return to Collection
          </Link>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm px-6 text-sm font-bold text-foreground transition-all hover:border-primary hover:bg-muted active:scale-95"
          >
            <Search className="h-4 w-4" />
            Latest Drops
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
