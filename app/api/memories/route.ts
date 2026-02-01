import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const result = await db.query(`
      SELECT 
        m.id, 
        m.date, 
        m.description, 
        m.mood,
        p.id as photo_id,
        p.url as photo_url
      FROM memories m
      LEFT JOIN photos p ON m.id = p.memory_id
      ORDER BY m.date DESC
    `);

        const memoriesMap = new Map();

        result.rows.forEach((row: any) => {
            if (!memoriesMap.has(row.id)) {
                memoriesMap.set(row.id, {
                    id: row.id,
                    date: row.date,
                    description: row.description,
                    mood: row.mood,
                    photos: []
                });
            }

            if (row.photo_url) {
                memoriesMap.get(row.id).photos.push({
                    id: row.photo_id,
                    url: row.photo_url
                });
            }
        });

        const memories = Array.from(memoriesMap.values());

        return NextResponse.json(memories);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { date, description, mood, photoUrls } = await request.json();
        const { v4: uuidv4 } = await import('uuid');

        const memoryId = uuidv4();

        // Postgres Transactions
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
                [memoryId, date, description, mood]
            );

            for (const url of photoUrls) {
                const photoId = uuidv4();
                await client.query(
                    'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
                    [photoId, memoryId, url]
                );
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        return NextResponse.json({ success: true, id: memoryId });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
    }
}
