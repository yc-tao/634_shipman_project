import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { section, prompt, currentContent } = await request.json();

    const systemPrompt = `You are an expert resume writer. Improve the following ${section} section based on this request: "${prompt}". 
    Maintain a professional tone and focus on impactful achievements. Keep the format consistent with the current content.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: currentContent || "Generate new content" }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error generating content' }, { status: 500 });
  }
}