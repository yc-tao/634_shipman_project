// src/app/api/interview-feedback/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the types needed for the API
interface InterviewFeedbackRequest {
  answer: string;
  question: string;
  keyPoints: string[];
  position: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export async function POST(request: Request) {
  try {
    // Parse and type the request body
    const { answer, question, keyPoints, position }: InterviewFeedbackRequest = await request.json();

    // Validate required fields
    if (!answer || !question || !keyPoints || !position) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer for ${position} positions. Analyze the candidate's answer and provide constructive feedback. Focus on: content completeness, STAR method usage, technical accuracy, and communication clarity. Format feedback with emojis for key points.`
        },
        {
          role: "user",
          content: `Question: ${question}\nExpected key points: ${keyPoints.join(', ')}\nCandidate's answer: ${answer}`
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ 
      feedback: response.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error generating feedback' }, 
      { status: 500 }
    );
  }
}