'use client';

import { useState } from 'react';
import { AdaptiveTheme } from '@/components/AdaptiveTheme';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { ChatInterface } from '@/components/ChatInterface';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

interface MemoryViewerProps {
    memory: any;
    photos: { id: string, url: string }[];
    messages: any[];
}

export function MemoryViewer({ memory, photos, messages }: MemoryViewerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const heroPhoto = photos[activeIndex]?.url || '';

    return (
        <AdaptiveTheme imageUrl={heroPhoto}>
            <div className="h-screen flex flex-col md:flex-row overflow-hidden font-nunito selection:bg-[var(--adaptive-accent)] selection:text-[var(--adaptive-bg)]">

                {/* Visuals Panel */}
                <div className="relative flex-1 bg-black/20 flex flex-col justify-center transition-colors duration-1000">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
                        <Link href="/" className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 text-white/90 rounded-full backdrop-blur-md transition-all border border-white/5 hover:scale-105 active:scale-95 group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <PhotoCarousel
                        photos={photos}
                        activeIndex={activeIndex}
                        onIndexChange={setActiveIndex}
                    />

                    {/* Metadata Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 pt-32 bg-gradient-to-t from-[var(--adaptive-bg)] via-[var(--adaptive-bg)]/60 to-transparent pointer-events-none transition-colors duration-1000">
                        <div className="max-w-2xl mx-auto md:ml-0 pointer-events-auto">
                            <div className="flex items-center gap-3 text-white/80 text-xs font-bold tracking-widest uppercase mb-3">
                                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Calendar className="w-3 h-3" />
                                    <time>{new Date(memory.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</time>
                                </div>
                                {memory.mood && (
                                    <span className="px-3 py-1 rounded-full border border-white/20 text-white/90">
                                        {memory.mood}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-white text-3xl md:text-5xl font-lora leading-tight text-balance shadow-black drop-shadow-md">
                                {memory.description}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="w-full md:w-[500px] h-[50vh] md:h-auto bg-[var(--adaptive-bg)] border-l border-white/5 flex flex-col shadow-2xl relative z-10 transition-colors duration-1000">
                    <div className="p-6 border-b border-white/5 bg-black/5 backdrop-blur-xl flex justify-between items-center sticky top-0 z-10">
                        <div>
                            <h2 className="font-lora text-2xl text-[var(--adaptive-fg)] font-medium tracking-tight">Memory Companion</h2>
                            <p className="text-[var(--adaptive-fg)]/60 text-sm mt-0.5 font-nunito">Reflecting on the past</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <ChatInterface photoId={memory.id} initialMessages={messages} />
                    </div>
                </div>
            </div>
        </AdaptiveTheme>
    );
}
