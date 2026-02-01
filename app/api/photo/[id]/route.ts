import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15 params is a Promise
) {
    try {
        const { id } = await params;
        const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);

        if (!photo) {
            return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
        }

        const messages = db.prepare('SELECT * FROM messages WHERE photo_id = ? ORDER BY timestamp ASC').all(id);

        return NextResponse.json({ photo, messages });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch photo details' }, { status: 500 });
    }
}
