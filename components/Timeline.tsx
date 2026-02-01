'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { PhotoCollage } from './PhotoCollage';

interface Memory {
    id: string;
    date: string;
    description: string;
    mood: string;
    photos: { id: string, url: string }[];
}

export function Timeline() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMemories() {
            try {
                const response = await fetch('/api/memories');
                if (response.ok) {
                    const data = await response.json();
                    setMemories(data);
                }
            } catch (error) {
                console.error('Failed to fetch memories', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMemories();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-[#D4C5B0] border-t-[#4A4036] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-12">
            <div className="space-y-20">
                {memories.map((memory, index) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group"
                    >
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <div className="w-2 h-2 rounded-full bg-[#D4C5B0]" />
                            <span className="font-nunito text-sm font-semibold tracking-wide uppercase text-[#4A4036]/70 dark:text-[#E7E5E4]/70">
                                {new Date(memory.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <Link href={`/memory/${memory.id}`} className="block">
                            <div className="mb-6">
                                <PhotoCollage photos={memory.photos} />
                            </div>

                            <div className="pl-2 border-l-2 border-[#D4C5B0]/30 space-y-2">
                                <h3 className="font-lora text-2xl font-medium text-[#4A4036] dark:text-[#E7E5E4] group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {memory.description}
                                </h3>
                                {memory.mood && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#F3EFE9] dark:bg-[#352F2B] text-xs font-nunito font-bold text-[#8C7B6C] dark:text-[#A8A29E]">
                                        {memory.mood}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
