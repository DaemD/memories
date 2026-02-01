import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Save user message
        await db.query(
            'INSERT INTO messages (memory_id, role, content, timestamp) VALUES ($1, $2, $3, $4)',
            [id, 'user', message, new Date().toISOString()]
        );

        // Fetch memory photos for context
        const photosResult = await db.query('SELECT url FROM photos WHERE memory_id = $1', [id]);
        const photos = photosResult.rows as any[];

        // Fetch recent chat history
        const historyResult = await db.query('SELECT role, content FROM messages WHERE memory_id = $1 ORDER BY timestamp ASC', [id]);
        const history = historyResult.rows as any[];

        // OpenAI Integration
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI();
        const systemPrompt = `You are a warm, reflective, and friendly memory companion. 
        You are looking at a collection of photos from a memory provided by the user.
        Your goal is to help the user relive this memory by asking curious questions or making observations.
        Keep your responses concise (1-2 sentences) and conversational. 
        Never be invasive, romantic, or judgmental. Be supportive and nostalgic.`;

        // Prepare previous messages
        const previousMessages = history.slice(0, -1).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
        }));

        // Prepare User Message Block with Vision
        const userContent: any[] = [{ type: "text", text: message }];

        photos.forEach(p => {
            userContent.push({
                type: "image_url",
                image_url: { url: p.url, detail: "low" }
            });
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...previousMessages,
                {
                    role: "user",
                    content: userContent
                }
            ],
            max_tokens: 150,
        });

        const aiResponse = response.choices[0].message.content || "I'm having trouble connecting to my memory banks right now.";

        // Save AI response
        await db.query(
            'INSERT INTO messages (memory_id, role, content, timestamp) VALUES ($1, $2, $3, $4)',
            [id, 'assistant', aiResponse, new Date().toISOString()]
        );

        return NextResponse.json({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
