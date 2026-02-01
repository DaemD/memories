'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    photoId: string;
    initialMessages: any[];
}

export function ChatInterface({ photoId, initialMessages }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages || []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/memory/${photoId}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-[var(--adaptive-fg)]/40 text-center p-8 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-[var(--adaptive-accent)]" />
                        </div>
                        <div>
                            <p className="font-lora text-xl text-[var(--adaptive-fg)] font-medium">Relive the moment</p>
                            <p className="text-sm font-nunito text-[var(--adaptive-fg)]/60 mt-2">Share a thought or ask a question<br />to start the conversation.</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i}
                        className={cn(
                            "flex flex-col max-w-[85%]",
                            msg.role === 'user' ? "ml-auto items-end" : "items-start"
                        )}
                    >
                        <span className="text-[10px] uppercase tracking-widest text-[var(--adaptive-fg)]/50 mb-1 px-1">
                            {msg.role === 'user' ? 'You' : 'Companion'}
                        </span>

                        <div className={cn(
                            "px-6 py-4 text-[16px] leading-relaxed font-nunito shadow-sm relative group backdrop-blur-md",
                            msg.role === 'user'
                                ? "bg-[var(--adaptive-accent)] text-[var(--adaptive-bg)] rounded-3xl rounded-tr-sm font-medium"
                                : "bg-white/10 text-[var(--adaptive-fg)] border border-white/10 rounded-3xl rounded-tl-sm"
                        )}>
                            {msg.role === 'assistant' && (
                                <Sparkles className="w-4 h-4 text-[var(--adaptive-accent)] absolute -left-6 top-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-start max-w-[85%]"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-[var(--adaptive-fg)]/50 mb-1 px-1">Companion</span>
                        <div className="px-6 py-5 rounded-3xl rounded-tl-sm bg-white/10 border border-white/10 shadow-sm backdrop-blur-md">
                            <div className="flex gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--adaptive-accent)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1.5 h-1.5 bg-[var(--adaptive-accent)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1.5 h-1.5 bg-[var(--adaptive-accent)] rounded-full animate-bounce" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 md:p-6 bg-gradient-to-t from-black/20 to-transparent z-10">
                <form onSubmit={handleSubmit} className="relative group">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your memory..."
                        className="w-full pl-6 pr-14 py-4 rounded-full bg-white/10 border-2 border-white/10 text-[var(--adaptive-fg)] placeholder-white/30 focus:outline-none focus:border-[var(--adaptive-accent)]/50 focus:bg-white/20 transition-all font-nunito text-base shadow-sm backdrop-blur-md"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-2.5 rounded-full bg-[var(--adaptive-accent)] text-[var(--adaptive-bg)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
