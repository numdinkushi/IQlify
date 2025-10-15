/**
 * Human-readable workflow definitions
 * Edit these configurations to modify your VAPI assistant workflows
 */

export interface WorkflowConfig {
    name: string;
    description: string;
    type: 'interview' | 'assessment' | 'feedback';
    functions: FunctionConfig[];
    systemPrompt: string;
    firstMessage: string;
}

export interface FunctionConfig {
    name: string;
    description: string;
    parameters: ParameterConfig[];
    endpoint?: string; // Optional: custom endpoint for this function
}

export interface ParameterConfig {
    name: string;
    type: 'string' | 'number' | 'array' | 'boolean' | 'object';
    description: string;
    required: boolean;
    enum?: string[]; // For string types with specific options
    defaultValue?: any;
}

/**
 * INTERVIEW WORKFLOW CONFIGURATION
 * 
 * This workflow conducts technical interviews with the following flow:
 * 1. Greets candidate and asks about role/experience
 * 2. Generates personalized interview questions
 * 3. Asks questions one by one
 * 4. Evaluates each answer with feedback
 * 5. Provides overall assessment
 */
export const INTERVIEW_WORKFLOW: WorkflowConfig = {
    name: "Technical Interview",
    description: "Conducts comprehensive technical interviews with AI-generated questions and real-time evaluation",
    type: "interview",

    systemPrompt: `You are an expert technical interviewer for IQlify, a gamified learning platform. 

CRITICAL: Be conversational and interactive. Follow these rules:

1. Ask ONE question at a time and WAIT for their response
2. Keep your messages SHORT and conversational
3. If you don't get a response, wait 3-5 seconds then gently ask again
4. Don't talk continuously - give the candidate time to speak
5. Listen actively and respond to what they actually say

Interview process:
- Start by asking about their role and experience level
- Once you have this info, use generate_interview_questions to create personalized questions
- Ask ONE question at a time and wait for their answer
- Use evaluate_answer to provide brief feedback after each answer
- Continue until you've covered 3-5 questions

Be patient, supportive, and give them space to respond.`,

    firstMessage: `Hi! I'm your technical interviewer today. 

What role are you applying for?`,

    functions: [
        {
            name: "generate_interview_questions",
            description: "Generates personalized interview questions based on role and experience level",
            parameters: [
                {
                    name: "role",
                    type: "string",
                    description: "The job role or position the candidate is interviewing for",
                    required: true
                },
                {
                    name: "level",
                    type: "string",
                    description: "Experience level of the candidate",
                    required: true,
                    enum: ["junior", "mid", "senior", "lead", "principal"]
                },
                {
                    name: "techstack",
                    type: "array",
                    description: "Technologies and frameworks to focus on",
                    required: true,
                    defaultValue: []
                },
                {
                    name: "amount",
                    type: "number",
                    description: "Number of questions to generate (default: 5)",
                    required: false,
                    defaultValue: 5
                },
                {
                    name: "skills",
                    type: "array",
                    description: "Specific skills to assess",
                    required: false,
                    defaultValue: []
                },
                {
                    name: "platform",
                    type: "string",
                    description: "Platform focus (web, mobile, backend, etc.)",
                    required: false,
                    defaultValue: "web"
                }
            ]
        },
        {
            name: "evaluate_answer",
            description: "Evaluates a candidate's answer and provides detailed feedback",
            parameters: [
                {
                    name: "question",
                    type: "string",
                    description: "The interview question that was asked",
                    required: true
                },
                {
                    name: "answer",
                    type: "string",
                    description: "The candidate's answer to evaluate",
                    required: true
                },
                {
                    name: "expectedAnswer",
                    type: "string",
                    description: "What a good answer should include (optional)",
                    required: false
                },
                {
                    name: "difficulty",
                    type: "string",
                    description: "Difficulty level of the question",
                    required: false,
                    enum: ["easy", "medium", "hard"]
                }
            ]
        }
    ]
};

/**
 * ASSESSMENT WORKFLOW CONFIGURATION
 * 
 * This workflow creates and administers skills assessments
 */
export const ASSESSMENT_WORKFLOW: WorkflowConfig = {
    name: "Skills Assessment",
    description: "Creates and administers comprehensive skills assessments",
    type: "assessment",

    systemPrompt: `You are a skills assessment coordinator for IQlify. Your role is to:

1. Understand what skills the candidate wants to be assessed on
2. Create a structured assessment using create_assessment
3. Guide them through the assessment questions
4. Provide real-time feedback and encouragement
5. Generate a comprehensive evaluation at the end

Be encouraging and focus on helping them identify their strengths and areas for improvement.`,

    firstMessage: `Welcome to IQlify Skills Assessment! I'll help you evaluate your technical skills.

What skills would you like to be assessed on today? For example:
- Programming languages (JavaScript, Python, etc.)
- Frameworks (React, Node.js, etc.) 
- Concepts (Algorithms, System Design, etc.)

Just tell me the areas you'd like to focus on, and I'll create a personalized assessment for you!`,

    functions: [
        {
            name: "create_assessment",
            description: "Creates a structured skills assessment based on specified skills",
            parameters: [
                {
                    name: "skills",
                    type: "array",
                    description: "List of skills to assess",
                    required: true
                },
                {
                    name: "difficulty",
                    type: "string",
                    description: "Assessment difficulty level",
                    required: false,
                    enum: ["easy", "medium", "hard"],
                    defaultValue: "medium"
                },
                {
                    name: "duration",
                    type: "number",
                    description: "Assessment duration in minutes",
                    required: false,
                    defaultValue: 30
                }
            ]
        }
    ]
};

/**
 * FEEDBACK WORKFLOW CONFIGURATION
 * 
 * This workflow generates comprehensive feedback based on interview/assessment performance
 */
export const FEEDBACK_WORKFLOW: WorkflowConfig = {
    name: "Performance Feedback",
    description: "Generates detailed feedback and recommendations based on interview or assessment performance",
    type: "feedback",

    systemPrompt: `You are a performance feedback specialist for IQlify. Your role is to:

1. Gather information about the candidate's performance
2. Use generate_feedback to create comprehensive feedback
3. Provide actionable recommendations for improvement
4. Highlight strengths and areas for growth
5. Suggest next steps for their learning journey

Be constructive, encouraging, and specific in your feedback.`,

    firstMessage: `Welcome to IQlify Performance Review! I'll help you understand your interview/assessment performance.

To generate personalized feedback, I'll need some information about your session. What type of evaluation did you just complete?`,

    functions: [
        {
            name: "generate_feedback",
            description: "Generates comprehensive feedback based on performance data",
            parameters: [
                {
                    name: "interviewId",
                    type: "string",
                    description: "Unique identifier for the interview session",
                    required: true
                },
                {
                    name: "scores",
                    type: "object",
                    description: "Performance scores across different areas",
                    required: false
                },
                {
                    name: "answers",
                    type: "array",
                    description: "Candidate's answers to interview questions",
                    required: false
                },
                {
                    name: "overallPerformance",
                    type: "string",
                    description: "Overall performance rating",
                    required: false,
                    enum: ["excellent", "good", "fair", "needs improvement"]
                }
            ]
        }
    ]
};

/**
 * WORKFLOW REGISTRY
 * 
 * Add new workflows here to make them available
 */
export const WORKFLOW_REGISTRY = {
    interview: INTERVIEW_WORKFLOW,
    assessment: ASSESSMENT_WORKFLOW,
    feedback: FEEDBACK_WORKFLOW,
} as const;

export type WorkflowType = keyof typeof WORKFLOW_REGISTRY;
