'use client';

import { useEffect, useState } from 'react';
import { MemoryCard } from './MemoryCard';

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
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="text-center py-20 opacity-50">
                <p className="font-lora text-xl">No memories yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                {memories.map((memory, index) => (
                    <MemoryCard key={memory.id} memory={memory} index={index} />
                ))}
            </div>
        </div>
    );
}
