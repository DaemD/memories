import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Postgres queries
        const memoryResult = await db.query('SELECT * FROM memories WHERE id = $1', [id]);
        const memory = memoryResult.rows[0];

        if (!memory) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        const photosResult = await db.query('SELECT * FROM photos WHERE memory_id = $1', [id]);
        const messagesResult = await db.query('SELECT * FROM messages WHERE memory_id = $1 ORDER BY timestamp ASC', [id]);

        return NextResponse.json({
            ...memory,
            photos: photosResult.rows,
            messages: messagesResult.rows
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch memory details' }, { status: 500 });
    }
}
