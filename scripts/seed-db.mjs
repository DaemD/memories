import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

// Use env var or default to local postgres
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/memories';

const pool = new Pool({
  connectionString,
});

async function main() {
  console.log('Seeding database with Multi-Photo Memories...');
  const client = await pool.connect();

  try {
    // Create tables if not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        description TEXT,
        mood TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
        url TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        memory_id TEXT NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);

    // Check if we already have data
    const countResult = await client.query('SELECT count(*) as count FROM memories');
    if (parseInt(countResult.rows[0].count) > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    // Sample Data
    const memory1Id = uuidv4();
    await client.query(
      'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
      [memory1Id, '2023-06-15', 'Sunset at the beach with friends. The waves were perfect.', 'Nostalgic']
    );
    await client.query(
      'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
      [uuidv4(), memory1Id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80']
    );
    await client.query(
      'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
      [uuidv4(), memory1Id, 'https://images.unsplash.com/photo-1519046904884-53103b34b271?w=800&q=80']
    );

    const memory2Id = uuidv4();
    await client.query(
      'INSERT INTO memories (id, date, description, mood) VALUES ($1, $2, $3, $4)',
      [memory2Id, '2023-12-25', 'Cozy Christmas morning. Hot cocoa and snow outside.', 'Joyful']
    );
    await client.query(
      'INSERT INTO photos (id, memory_id, url) VALUES ($1, $2, $3)',
      [uuidv4(), memory2Id, 'https://images.unsplash.com/photo-1543258103-a62bdc069871?w=800&q=80']
    );

    console.log('Database seeded!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main().catch(console.error);
