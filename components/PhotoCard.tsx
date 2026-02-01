'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface PhotoProps {
    id: string;
    url: string;
    date: string;
    description?: string;
    mood?: string;
    index: number;
}

export function PhotoCard({ id, url, date, description, mood, index }: PhotoProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative block w-full max-w-2xl mx-auto mb-16 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            <Link href={`/photo/${id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={url}
                        alt={description || 'Memory'}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium">Revisit this memory</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <time>{new Date(date).toLocaleDateString(undefined, { dateStyle: 'long' })}</time>
                        {mood && (
                            <>
                                <span>•</span>
                                <span className="capitalize text-zinc-800 dark:text-zinc-200 font-medium">{mood}</span>
                            </>
                        )}
                    </div>

                    {description && (
                        <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
