// app/api/huggingface/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getHuggingFaceAdvice } from '../../../lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const advice = await getHuggingFaceAdvice(prompt);

    return NextResponse.json({ advice });
  } catch (err) {
    console.error('Hugging Face Error:', err);
    return NextResponse.json({ error: 'Failed to get advice' }, { status: 500 });
  }
}
