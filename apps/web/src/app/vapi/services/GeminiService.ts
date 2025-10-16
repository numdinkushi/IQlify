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

    /**
     * Analyzes interview transcript and generates comprehensive grading
     */
    async analyzeInterviewTranscript(
        transcript: string,
        role: string,
        level: string,
        techstack: string[] = []
    ): Promise<any> {
        try {
            const model = this.genAI.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    temperature: 0.3, // Lower temperature for more consistent grading
                    maxOutputTokens: 2000,
                }
            });

            const prompt = this.buildGradingPrompt(transcript, role, level, techstack);
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            return this.parseGradingResponse(response);
        } catch (error) {
            console.error('Error analyzing interview transcript:', error);
            throw error;
        }
    }

    /**
     * Builds a comprehensive grading prompt for transcript analysis
     */
    private buildGradingPrompt(
        transcript: string,
        role: string,
        level: string,
        techstack: string[]
    ): string {
        return `You are an expert technical interviewer and evaluator. Analyze the following interview transcript and provide comprehensive grading.

**Interview Context:**
- Role: ${role}
- Level: ${level}
- Tech Stack: ${techstack.join(', ') || 'General'}

**Interview Transcript:**
${transcript}

**Evaluation Criteria:**
1. Technical Knowledge (0-10): Understanding of relevant technologies, concepts, and best practices
2. Communication Skills (0-10): Clarity, articulation, and ability to explain complex topics
3. Problem-Solving (0-10): Logical thinking, approach to challenges, and analytical skills
4. Experience Relevance (0-10): How well their experience matches the role requirements
5. Cultural Fit (0-10): Professionalism, attitude, and team collaboration potential

**Instructions:**
- Provide specific examples from the transcript to support your scores
- Give constructive feedback for improvement
- Consider the role level (${level}) when evaluating
- Be objective and fair in your assessment
- Provide an overall recommendation: "hire", "no-hire", or "maybe"

**Required JSON Format:**
{
  "overallScore": number (0-10),
  "sections": {
    "technical": {
      "score": number (0-10),
      "feedback": "string with specific examples",
      "strengths": ["string array"],
      "improvements": ["string array"]
    },
    "communication": {
      "score": number (0-10),
      "feedback": "string with specific examples",
      "strengths": ["string array"],
      "improvements": ["string array"]
    },
    "problemSolving": {
      "score": number (0-10),
      "feedback": "string with specific examples",
      "strengths": ["string array"],
      "improvements": ["string array"]
    },
    "experienceRelevance": {
      "score": number (0-10),
      "feedback": "string with specific examples",
      "strengths": ["string array"],
      "improvements": ["string array"]
    },
    "culturalFit": {
      "score": number (0-10),
      "feedback": "string with specific examples",
      "strengths": ["string array"],
      "improvements": ["string array"]
    }
  },
  "recommendation": "hire|no-hire|maybe",
  "summary": "Overall assessment summary",
  "keyHighlights": ["string array of key positive points"],
  "areasForImprovement": ["string array of key areas to improve"]
}

Return ONLY the JSON object, no additional text.`;
    }

    /**
     * Parses the AI grading response into structured data
     */
    private parseGradingResponse(response: string): any {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON object found in response');
            }

            const grading = JSON.parse(jsonMatch[0]);

            // Validate required fields
            if (!grading.overallScore || !grading.sections || !grading.recommendation) {
                throw new Error('Invalid grading structure');
            }

            return grading;
        } catch (error) {
            console.error('Error parsing grading response:', error);
            // Return fallback grading structure
            return {
                overallScore: 5,
                sections: {
                    technical: { score: 5, feedback: "Unable to analyze transcript", strengths: [], improvements: [] },
                    communication: { score: 5, feedback: "Unable to analyze transcript", strengths: [], improvements: [] },
                    problemSolving: { score: 5, feedback: "Unable to analyze transcript", strengths: [], improvements: [] },
                    experienceRelevance: { score: 5, feedback: "Unable to analyze transcript", strengths: [], improvements: [] },
                    culturalFit: { score: 5, feedback: "Unable to analyze transcript", strengths: [], improvements: [] }
                },
                recommendation: "maybe",
                summary: "Analysis failed - manual review required",
                keyHighlights: [],
                areasForImprovement: ["Transcript analysis failed"]
            };
        }
    }
}



