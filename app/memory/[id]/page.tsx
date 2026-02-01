import db from '@/lib/db';
import { MemoryViewer } from '@/components/MemoryViewer';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MemoryPage({ params }: PageProps) {
    const { id } = await params;

    const memoryResult = await db.query('SELECT * FROM memories WHERE id = $1', [id]);
    const memory = memoryResult.rows[0];

    if (!memory) {
        notFound();
    }

    const photosResult = await db.query('SELECT id, url FROM photos WHERE memory_id = $1', [id]);
    const photos = photosResult.rows as any[];

    const messagesResult = await db.query('SELECT role, content FROM messages WHERE memory_id = $1 ORDER BY timestamp ASC', [id]);
    const messages = messagesResult.rows as any[];

    return <MemoryViewer memory={memory} photos={photos} messages={messages} />;
}
