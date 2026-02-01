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
        db.prepare(
            'INSERT INTO messages (photo_id, role, content, timestamp) VALUES (?, ?, ?, ?)'
        ).run(id, 'user', message, new Date().toISOString());

        // Fetch photo details for context (URL is needed for vision)
        const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id) as any;

        // Fetch recent chat history
        const history = db.prepare('SELECT role, content FROM messages WHERE photo_id = ? ORDER BY timestamp ASC').all(id) as any[];

        // OpenAI Integration
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI();

        const systemPrompt = `You are a warm, reflective, and friendly memory companion. 
        You are looking at a photo from the user's past. 
        Your goal is to help the user relive this memory by asking curious questions or making observations about the vibe, the people, or the setting.
        Keep your responses concise (1-2 sentences) and conversational. 
        Never be invasive, romantic, or judgmental. Be supportive and nostalgic.`;

        // Filter out the message we just added (last one) to avoid duplication in history slicing if needed, 
        // or just rely on the fact that 'history' now includes it.
        // We want to construct the messages array carefully.
        const previousMessages = history.slice(0, -1).map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content
        }));

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...previousMessages,
                {
                    role: "user",
                    content: [
                        { type: "text", text: message },
                        {
                            type: "image_url",
                            image_url: {
                                url: photo.url,
                                detail: "low"
                            }
                        }
                    ]
                }
            ],
            max_tokens: 150,
        });

        const aiResponse = response.choices[0].message.content || "I'm having trouble connecting to my memory banks right now.";

        // Save AI response
        db.prepare(
            'INSERT INTO messages (photo_id, role, content, timestamp) VALUES (?, ?, ?, ?)'
        ).run(id, 'assistant', aiResponse, new Date().toISOString());

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
