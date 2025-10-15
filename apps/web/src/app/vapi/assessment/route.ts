import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from '../services/GeminiService';

/**
 * Assessment Creation Endpoint
 * Creates skills assessments for candidates
 */

export async function GET() {
    return NextResponse.json({
        message: "Assessment Creation API",
        status: "active",
        version: "1.0",
        description: "Creates skills assessments for candidates",
    });
}

export async function POST(request: NextRequest) {
    try {
        const { skills, difficulty = 'medium', assessmentType = 'technical' } = await request.json();

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Skills array is required and must not be empty',
                },
                { status: 400 }
            );
        }

        const geminiService = new GeminiService();

        const assessmentPrompt = `Create a comprehensive skills assessment for the following:

**Skills to Assess**: ${skills.join(', ')}
**Difficulty Level**: ${difficulty}
**Assessment Type**: ${assessmentType}

Generate a structured assessment with:
1. 5-10 questions covering all listed skills
2. A mix of multiple choice, short answer, and practical questions
3. Clear evaluation criteria
4. Time estimates for each question

Format as JSON:
{
  "assessmentId": "<unique-id>",
  "title": "<assessment title>",
  "description": "<brief description>",
  "estimatedTime": "<total time in minutes>",
  "questions": [
    {
      "id": "<question-id>",
      "type": "multiple-choice|short-answer|practical|coding",
      "question": "<question text>",
      "skill": "<primary skill being tested>",
      "difficulty": "easy|medium|hard",
      "timeEstimate": "<time in minutes>",
      "options": ["<for multiple choice>"],
      "correctAnswer": "<for multiple choice>",
      "evaluationCriteria": ["<criteria for evaluation>"]
    }
  ]
}

Return ONLY the JSON.`;

        const response = await geminiService.generateConversationalResponse(
            'You are an expert in creating technical assessments.',
            assessmentPrompt
        );

        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const assessment = JSON.parse(jsonMatch[0]);
                return NextResponse.json({
                    success: true,
                    assessment,
                });
            }
        } catch (error) {
            console.error('Error parsing assessment:', error);
        }

        // Fallback
        return NextResponse.json({
            success: true,
            assessment: {
                assessmentId: `assessment_${Date.now()}`,
                title: `${skills.join(', ')} Assessment`,
                description: response,
                estimatedTime: '30 minutes',
                questions: [],
            },
        });
    } catch (error) {
        console.error('Error in assessment endpoint:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}


