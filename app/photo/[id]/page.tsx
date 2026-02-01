import db from '@/lib/db';
import { ChatInterface } from '@/components/ChatInterface';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PhotoPage({ params }: PageProps) {
    const { id } = await params;

    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as any;

    if (!photo) {
        notFound();
    }

    const messages = db.prepare('SELECT role, content FROM messages WHERE photo_id = ? ORDER BY timestamp ASC').all(id);

    return (
        <div className="h-screen bg-black text-zinc-100 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Photo */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-4">
                <Link href="/" className="absolute top-4 left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="relative w-full h-full max-h-screen">
                    <img
                        src={photo.url}
                        alt={photo.description || 'Memory'}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-xl mx-auto md:ml-0">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                            <Calendar className="w-4 h-4" />
                            <time>{new Date(photo.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</time>
                        </div>
                        <p className="text-xl md:text-2xl font-light leading-relaxed">
                            {photo.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat */}
            <div className="w-full md:w-[450px] bg-zinc-900 border-l border-zinc-800 flex flex-col">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900 z-10">
                    <h2 className="font-semibold text-lg">Memory Companion</h2>
                    <p className="text-zinc-400 text-xs">Relive this moment together</p>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                    <ChatInterface photoId={id} initialMessages={messages} />
                </div>
            </div>
        </div>
    );
}
