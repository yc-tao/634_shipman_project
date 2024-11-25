// src/app/api/generate-questions/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface QuestionGenerationRequest {
  position: string;
  skills: string;
  experience: string;
  education: string;
  category?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(request: Request) {
  try {
    const { position, skills, experience, education, category }: QuestionGenerationRequest = await request.json();

    const prompt = `Generate interview questions for a ${position} position.
    Candidate background:
    - Skills: ${skills}
    - Experience: ${experience}
    - Education: ${education}
    ${category && category !== 'all' ? `Focus on ${category} questions.` : ''}
    
    Generate 5 relevant interview questions. For each question, include:
    1. The question text
    2. Category (technical, behavioral, experience, or education)
    3. 3-4 key points the answer should cover
    
    Format as JSON array with structure:
    [{"id": "1", "text": "question", "category": "type", "keyPoints": ["point1", "point2", "point3"]}]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate relevant questions based on the candidate's background. Output must be valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Response content is null');
    }
    const questions = JSON.parse(content);
    return NextResponse.json(questions);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error generating questions' }, 
      { status: 500 }
    );
  }
}