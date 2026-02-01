'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
    memory: {
        id: string;
        date: string;
        description: string;
        mood: string;
        photos: { id: string; url: string }[];
    };
    index: number;
}

export function MemoryCard({ memory, index }: MemoryCardProps) {
    const mainPhoto = memory.photos[0]?.url || '';
    const date = new Date(memory.date).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-zinc-100 dark:bg-zinc-900"
        >
            <Link href={`/memory/${memory.id}`} className="block w-full h-full">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img
                        src={mainPhoto}
                        alt={memory.description}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Dark Gradient Overlay - Always visible at bottom, stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        {/* Meta Info */}
                        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/70 mb-2">
                            <Calendar className="w-3 h-3" />
                            <span>{date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-lora text-xl md:text-2xl font-medium leading-snug mb-3 line-clamp-2 text-balance drop-shadow-md">
                            {memory.description}
                        </h3>

                        {/* Hidden Details that slide up */}
                        <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="pt-2 flex items-center gap-3">
                                {memory.mood && (
                                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-nunito font-semibold border border-white/10">
                                        {memory.mood}
                                    </span>
                                )}
                                <span className="text-xs text-white/60 font-medium">
                                    {memory.photos.length} {memory.photos.length === 1 ? 'Photo' : 'Photos'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
