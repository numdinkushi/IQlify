/**
 * Language utilities for VAPI workflows
 */

import { LanguageCode, SUPPORTED_LANGUAGES } from '@/lib/language-constants';
import { WorkflowConfig } from './index';

/**
 * Adds language instruction to system prompt
 */
function addLanguageInstruction(systemPrompt: string, language: LanguageCode): string {
    const lang = SUPPORTED_LANGUAGES[language];
    const languageInstruction = `\n\nCRITICAL LANGUAGE REQUIREMENT: You MUST conduct this entire interview in ${lang.nativeName} (${lang.name}). 
- All your questions must be asked in ${lang.nativeName}
- All your responses and feedback must be in ${lang.nativeName}
- All your evaluations and assessments must be written in ${lang.nativeName}
- Do NOT switch to English or any other language at any point
- If the candidate responds in a different language, acknowledge it but continue in ${lang.nativeName}`;

    return systemPrompt + languageInstruction;
}

/**
 * Creates a language-aware workflow config from a base workflow
 */
export function createLanguageAwareWorkflow(
    baseWorkflow: WorkflowConfig,
    language: LanguageCode
): WorkflowConfig {
    const updatedPrompt = addLanguageInstruction(baseWorkflow.systemPrompt, language);

    return {
        ...baseWorkflow,
        systemPrompt: updatedPrompt,
        firstMessage: language !== 'en'
            ? `こんにちは！今日はあなたの技術面接官です。どの役職に応募していますか？` // This should be translated based on language
            : baseWorkflow.firstMessage,
    };
}

