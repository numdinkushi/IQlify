# Phase 4: AI Analysis - Gemini Evaluation Code

## Core Function: `analyzeInterviewTranscript()`

**Location:** `apps/web/src/app/vapi/services/GeminiService.ts` (lines 142-171)

```typescript
async analyzeInterviewTranscript(
    transcript: string,
    role: string,
    level: string,
    techstack: string[] = []
): Promise<any> {
    try {
        // 1. Initialize Gemini model with specific configuration
        const model = this.genAI.getGenerativeModel({
            model: this.model, // "gemini-pro"
            generationConfig: {
                temperature: 0.3, // ✅ LOW TEMPERATURE for consistency
                maxOutputTokens: 2000,
            }
        });

        // 2. Build the grading prompt
        const prompt = this.buildGradingPrompt(transcript, role, level, techstack);
        
        // 3. Get AI response
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // 4. Parse and return structured grading
        return this.parseGradingResponse(response);
    } catch (error) {
        console.error('Error analyzing interview transcript:', error);
        throw error;
    }
}
```

---

## Critical Configuration: Temperature 0.3

```typescript
generationConfig: {
    temperature: 0.3, // Lower = More Consistent
    maxOutputTokens: 2000,
}
```

**Why 0.3?**
- **Low temperature** ensures consistent, deterministic grading
- **Higher temperature (0.7-1.0)** would be more creative but inconsistent
- **Lower temperature (0.0-0.3)** gives stable, fair evaluations
- This makes grading **predictable** and **repeatable**

---

## Grading Prompt Builder

**Location:** `buildGradingPrompt()` (lines 185-263)

```typescript
private buildGradingPrompt(
    transcript: string,
    role: string,
    level: string,
    techstack: string[]
): string {
    return `You are an expert technical interviewer and evaluator. 
Analyze the following interview transcript and provide comprehensive grading.

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
```

---

## Five Evaluation Dimensions

### 1. Technical Knowledge (0-10)
- Understanding of technologies
- Knowledge of best practices
- Conceptual clarity

### 2. Communication Skills (0-10)
- Clarity of explanation
- Articulation ability
- Ability to simplify complex topics

### 3. Problem-Solving (0-10)
- Logical thinking
- Approach to challenges
- Analytical skills

### 4. Experience Relevance (0-10)
- Relevance of past experience
- How well it matches role requirements
- Practical applicability

### 5. Cultural Fit (0-10)
- Professionalism
- Attitude
- Team collaboration potential

---

## Response Parser

**Location:** `parseGradingResponse()` (lines 267-307)

```typescript
private parseGradingResponse(response: string): any {
    try {
        // 1. Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in response');
        }

        // 2. Parse JSON
        const grading = JSON.parse(jsonMatch[0]);

        // 3. Validate required fields
        if (!grading.overallScore || !grading.sections || !grading.recommendation) {
            throw new Error('Invalid grading structure');
        }

        // 4. Return validated grading
        return grading;
    } catch (error) {
        console.error('Error parsing grading response:', error);
        // Fallback: Return neutral grading
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
```

---

## Example Gemini Response

```json
{
  "overallScore": 8.5,
  "sections": {
    "technical": {
      "score": 8,
      "feedback": "Demonstrated strong understanding of React hooks and state management. Showed familiarity with modern JavaScript features like async/await and Promises.",
      "strengths": [
        "Strong grasp of React ecosystem",
        "Good understanding of modern JavaScript",
        "Knowledgeable about best practices"
      ],
      "improvements": [
        "Could explain performance optimization techniques in more detail",
        "Should demonstrate deeper understanding of React's internal workings"
      ]
    },
    "communication": {
      "score": 9,
      "feedback": "Clear and articulate throughout the interview. Explained technical concepts in an accessible manner.",
      "strengths": [
        "Excellent clarity",
        "Good at breaking down complex topics",
        "Patient and thorough explanations"
      ],
      "improvements": [
        "Could be more concise at times"
      ]
    },
    "problemSolving": {
      "score": 8,
      "feedback": "Logical approach to problem-solving. Systematically broke down problems before attempting to solve them.",
      "strengths": [
        "Methodical approach",
        "Good analytical thinking",
        "Considers edge cases"
      ],
      "improvements": [
        "Could think through solutions faster"
      ]
    },
    "experienceRelevance": {
      "score": 7,
      "feedback": "Relevant experience with similar technologies, though not identical to role requirements.",
      "strengths": [
        "Practical experience",
        "Real-world project knowledge"
      ],
      "improvements": [
        "Needs more experience with specific tech stack mentioned in role"
      ]
    },
    "culturalFit": {
      "score": 9,
      "feedback": "Professional, enthusiastic, and demonstrated good teamwork examples.",
      "strengths": [
        "Positive attitude",
        "Team-oriented",
        "Professional demeanor"
      ],
      "improvements": []
    }
  },
  "recommendation": "hire",
  "summary": "Strong performance with excellent communication and solid technical skills. Would be a good fit for the team.",
  "keyHighlights": [
    "Strong technical foundation",
    "Excellent communication skills",
    "Good problem-solving approach",
    "Positive cultural fit"
  ],
  "areasForImprovement": [
    "Deeper knowledge of performance optimization",
    "Faster problem-solving under time pressure",
    "More experience with specific tech stack"
  ]
}
```

---

## Call Flow Diagram

```
generateFinalGrading()
    ↓
Extract transcript from VAPI
    ↓
Validation checks pass
    ↓
geminiService.analyzeInterviewTranscript(transcript, role, level, techstack)
    ↓
┌─────────────────────────────────────┐
│  Gemini Model (Temperature: 0.3)   │
│  - Reads transcript                 │
│  - Evaluates 5 dimensions           │
│  - Generates JSON response          │
└─────────────────────────────────────┘
    ↓
parseGradingResponse()
    ↓
Return structured grading object
    ↓
Used for reward calculation & display
```

---

## Key Takeaways

1. **Temperature 0.3**: Ensures consistent, fair grading across all interviews
2. **Five Dimensions**: Comprehensive evaluation of different skill areas
3. **Structured Response**: JSON format for easy parsing and validation
4. **Error Handling**: Fallback mechanism prevents crashes
5. **Specific Examples**: AI provides concrete examples from transcript
6. **Actionable Feedback**: Not just scores, but strengths and improvements

