import { Vocabulary } from '@/types/vocabulary';
import { themeVocabularies } from '@/lib/themeVocabularies';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const VALID_THEMES = themeVocabularies.join(', ');

export async function enhanceVocabulary(
    vocab: Vocabulary,
    context?: string,
    fieldsToEnhance?: string[]
): Promise<Partial<Vocabulary>> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OpenAI API Key not found');
    }

    const prompt = `
    You are a professional Korean-Bangla language teacher. Improve the following vocabulary entry.
    
    Current Entry:
    Korean Word: ${vocab.korean_word}
    Bangla Meaning: ${vocab.bangla_meaning}
    Part of Speech: ${vocab.part_of_speech || 'Unknown'}
    
    Fields to Enhance: ${fieldsToEnhance ? fieldsToEnhance.join(', ') : 'All missing fields'}
    ${context ? `Extra Context: ${context}` : ''}

    Rules for each field:
    1. 'verb_forms': If POS is verb, provide present, past, future, and polite (honorific) forms in Korean Hangul.
    2. 'explanation': Provide a detailed usage explanation in Bengali. Include when to use it, where it's common, and stylistic nuances. Answer "who, what, where, when, why, how" if applicable. (Target: 50-150 characters).
    3. 'examples': Provide 2 real-world sentences. Return as a JSON array of { korean: string, bangla: string }. sentences should be practical for ESP Topic learners.
    4. 'themes': Pick 1-3 relevant categories ONLY from this list: ${VALID_THEMES}.
    5. 'chapters': If you know the EPS Topic chapter number, provide it as an array of numbers.
    6. 'romanization': Provide standard pronunciation in English (e.g., "sa-rang").
    7. 'part_of_speech': Correct or confirm the grammatical category.

    Return ONLY a single valid JSON object. Do not include markdown formatting or extra text.
    The keys in the JSON should map exactly to the fields requested: ${fieldsToEnhance ? fieldsToEnhance.join(', ') : 'korean_word, bangla_meaning, romanization, part_of_speech, explanation, examples, themes, chapters, verb_forms'}.
  `;

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a Korean-Bangla language specialist. Respond only with JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error('AI Enhancement failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
        const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanedContent);

        return result;
    } catch (e) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON');
    }
}
