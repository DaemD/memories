'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoCarouselProps {
    photos: { id: string; url: string }[];
    activeIndex: number;
    onIndexChange: (index: number) => void;
}

export function PhotoCarousel({ photos, activeIndex, onIndexChange }: PhotoCarouselProps) {
    const nextPhoto = () => {
        onIndexChange((activeIndex + 1) % photos.length);
    };

    const prevPhoto = () => {
        onIndexChange((activeIndex - 1 + photos.length) % photos.length);
    };

    if (photos.length === 0) return null;

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-transparent transition-colors duration-700">
            <AnimatePresence mode="wait">
                <motion.img
                    key={photos[activeIndex].id}
                    src={photos[activeIndex].url}
                    alt="Memory"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-full max-h-screen object-contain drop-shadow-2xl"
                />
            </AnimatePresence>

            {photos.length > 1 && (
                <>
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevPhoto}
                        className="absolute left-4 p-3 rounded-full bg-black/20 text-white/80 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm hover:scale-110 active:scale-90 z-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextPhoto}
                        className="absolute right-4 p-3 rounded-full bg-black/20 text-white/80 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm hover:scale-110 active:scale-90 z-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onIndexChange(i)}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    i === activeIndex
                                        ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        : "bg-white/30 hover:bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
