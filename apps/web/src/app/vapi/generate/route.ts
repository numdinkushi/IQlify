import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
    return new Response(JSON.stringify({ message: "Hello from VAPI generate endpoint!" }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function POST(request: Request) {
    const { prompt, role, model, temperature, level, techstack, skills, amount, platform, userId } = await request.json();
    const response = await fetch(`https://api.vapi.ai/generate`, {
        method: "POST",
        body: JSON.stringify({ prompt, role, model, temperature, level, techstack, skills, amount, platform, userId }),
    });

    try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

        const fullPrompt = `Prepare questions for a job interview for ${role}
          The questions should be based on the ${techstack} technology stack
          The questions should be based on the ${level} level
          The questions should be based on the ${amount} amount
          The questions should be based on the ${platform} platform
          The questions should be based on the ${userId} user id
          The questions should be based on the ${skills} skills
          The questions should be based on the ${prompt} prompt
          `;

        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        return new Response(JSON.stringify({ success: true, text }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error }), { status: 500 });
    }
}