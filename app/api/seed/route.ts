import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const { v4: uuidv4 } = await import('uuid');

        // Check if we already have data
        const countResult = await db.query('SELECT count(*) as count FROM memories');
        if (parseInt(countResult.rows[0].count) > 0) {
            return NextResponse.json({ message: 'Database already has data. Seeding skipped.' });
        }

        // Transactions not strictly necessary for this simple seed but good practice
        // We'll just run queries sequentially for simplicity in this helper

        // Sample Data
        const memory1Id = uuidv4();
        await db.query(
            'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
            [memory1Id, '2023-06-15', 'Sunset at the beach with friends. The waves were perfect.', 'Nostalgic']
        );
        await db.query(
            'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
            [uuidv4(), memory1Id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80']
        );
        await db.query(
            'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
            [uuidv4(), memory1Id, 'https://images.unsplash.com/photo-1519046904884-53103b34b271?w=800&q=80']
        );

        const memory2Id = uuidv4();
        await db.query(
            'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
            [memory2Id, '2023-12-25', 'Cozy Christmas morning. Hot cocoa and snow outside.', 'Joyful']
        );
        await db.query(
            'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
            [uuidv4(), memory2Id, 'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&q=80']
        );

        const memory3Id = uuidv4();
        await db.query(
            'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
            [memory3Id, '2024-01-01', 'New Year celebration in the city.', 'Excited']
        );
        await db.query(
            'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
            [uuidv4(), memory3Id, 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80']
        );

        return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
