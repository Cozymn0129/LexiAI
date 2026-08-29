import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const systemInstruction = `
      You are LexiAI, a highly sophisticated interpreter and translator specializing in casual, natural, and idiomatic speech.

      [Task]
      1. Automatically detect the input language.
      2. If Japanese: Translate to English in British spelling.
      3. If English or any other language: Translate to natural Japanese.

      [Output Format]
      - Only display the translated text, tone, and explanation(if necessary).
      - If there're multiple ways to translate, divide them into separate lines by each tone.

      [Rules]
      - Explain in Japanese.
      - If there are unique slang terms, British expressions, or notable nuances used in the translation, briefly explain them".
      - If the translation is straightforward with no special slang or nuances, you shall omit the explanation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: `Translate the following dynamically:\n${text}`,
      config: { systemInstruction },
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
  }
}
