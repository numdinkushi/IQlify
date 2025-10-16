import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config';
import { InterviewRequest, Question, InterviewResponse } from '../types';

/**
 * Service class for interacting with Google's Gemini AI
 * Follows Single Responsibility Principle - handles only Gemini AI operations
 */
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey?: string, model?: string) {
        const key = apiKey || GEMINI_CONFIG.apiKey;
        if (!key) {
            throw new Error('Gemini API key is required');
        }
        this.genAI = new GoogleGenerativeAI(key);
        this.model = model || GEMINI_CONFIG.defaultModel;
    }

    /**
     * Generates interview questions based on the provided request
     */
    async generateInterviewQuestions(request: InterviewRequest): Promise<InterviewResponse> {
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: request.temperature || GEMINI_CONFIG.defaultTemperature,
                    maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
                }
            });

            const prompt = this.buildInterviewPrompt(request);
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const questions = this.parseQuestionsFromResponse(text);

            return {
                success: true,
                questions,
                metadata: {
                    role: request.role,
                    level: request.level,
                    techstack: request.techstack,
                    generatedAt: new Date().toISOString(),
                },
            };
        } catch (error) {
            console.error('Error generating interview questions:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    /**
     * Builds a structured prompt for interview question generation
     */
    private buildInterviewPrompt(request: InterviewRequest): string {
        const {
            role,
            level,
            techstack,
            skills,
            amount,
            platform,
            prompt: customPrompt,
        } = request;

        return `You are an expert technical interviewer. Generate ${amount} high-quality interview questions for the following position:

**Role**: ${role}
**Level**: ${level}
**Platform**: ${platform}
**Tech Stack**: ${techstack.join(', ')}
**Key Skills**: ${skills.join(', ')}

${customPrompt ? `**Additional Context**: ${customPrompt}\n` : ''}

Requirements:
1. Questions should be appropriate for a ${level}-level candidate
2. Cover different aspects: technical knowledge, problem-solving, system design (if senior+), and practical experience
3. Include a mix of theoretical and practical questions
4. Each question should be clear and specific
5. Avoid overly generic questions

Format your response as a JSON array with the following structure:
[
  {
    "id": "1",
    "question": "Question text here",
    "difficulty": "easy|medium|hard",
    "category": "technical|behavioral|system-design|problem-solving",
    "expectedAnswer": "Brief outline of what a good answer should cover",
    "followUpQuestions": ["Follow-up question 1", "Follow-up question 2"]
  }
]

Return ONLY the JSON array, no additional text.`;
    }

    /**
     * Parses questions from AI response
     */
    private parseQuestionsFromResponse(response: string): Question[] {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }

            const questions = JSON.parse(jsonMatch[0]);

            // Validate and transform the questions
            return questions.map((q: any, index: number) => ({
                id: q.id || String(index + 1),
                question: q.question || '',
                difficulty: q.difficulty || 'medium',
                category: q.category || 'technical',
                expectedAnswer: q.expectedAnswer,
                followUpQuestions: q.followUpQuestions || [],
            }));
        } catch (error) {
            console.error('Error parsing questions:', error);
            // Fallback: return a single question with the raw response
            return [{
                id: '1',
                question: response,
                difficulty: 'medium',
                category: 'technical',
            }];
        }
    }

    /**
     * Generates a conversational response for VAPI assistant
     */
    async generateConversationalResponse(
        context: string,
        userMessage: string
    ): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const prompt = `${context}\n\nUser: ${userMessage}\n\nAssistant:`;

            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('Error generating conversational response:', error);
            throw error;
        }
    }
} 



