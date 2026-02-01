import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(msg);

  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';
    const { v4: uuidv4 } = await import('uuid');

    log("Starting seed process...");

    // Ensure tables exist (Self-healing)
    log("Checking/Creating tables...");
    await db.query(`
          CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL,
            description TEXT,
            mood TEXT
          );
        `);

    await db.query(`
          CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY,
            memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
            url TEXT NOT NULL
          );
        `);

    await db.query(`
          CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
          );
        `);

    // Check if we already have data
    const countResult = await db.query('SELECT count(*) as count FROM memories');
    const count = parseInt(countResult.rows[0].count);
    log(`Current memory count: ${count}`);

    if (count > 0 && !force) {
      log("Database has data. Skipping. Use ?force=true to override.");
      return NextResponse.json({
        success: false,
        message: 'Database already has data. Seeding skipped.',
        currentCount: count,
        logs
      });
    }

    if (force && count > 0) {
      log("Force enabled. Clearing existing data...");
      await db.query('DELETE FROM photos');
      await db.query('DELETE FROM messages');
      await db.query('DELETE FROM memories');
    }

    // Sample Data
    log("Inserting sample memories...");
    const memory1Id = uuidv4();
    await db.query(
      'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
      [memory1Id, '2023-06-15', 'Sunset at the beach with friends. The waves were perfect.', 'Nostalgic']
    );
    log(`Inserted memory 1: ${memory1Id}`);

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
    log(`Inserted memory 2: ${memory2Id}`);

    await db.query(
      'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
      [uuidv4(), memory2Id, 'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&q=80']
    );

    const memory3Id = uuidv4();
    await db.query(
      'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
      [memory3Id, '2024-01-01', 'New Year celebration in the city.', 'Excited']
    );
    log(`Inserted memory 3: ${memory3Id}`);

    await db.query(
      'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
      [uuidv4(), memory3Id, 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80']
    );

    const finalCountResult = await db.query('SELECT count(*) as count FROM memories');
    log(`Final memory count: ${finalCountResult.rows[0].count}`);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      finalCount: parseInt(finalCountResult.rows[0].count),
      logs
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    log(`ERROR: ${error.message}`);
    return NextResponse.json({
      error: 'Failed to seed database',
      details: error.message,
      logs
    }, { status: 500 });
  }
}
