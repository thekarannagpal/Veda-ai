import { GoogleGenAI } from '@google/genai';
import { IAssignment, ISection } from '../models/Assignment';

let ai: any;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Gemini API Key missing or invalid, using mock AI service.");
}

export const generateAssessment = async (assignment: IAssignment, pdfContent?: string): Promise<ISection[]> => {
  const promptText = `
    You are an AI Assessment Creator. 
    Create a question paper based on these parameters:
    - Subject/Title: ${assignment.title}
    - Question Types: ${assignment.questionTypes.join(', ')}
    - Total Questions: ${assignment.numberOfQuestions}
    - Total Marks: ${assignment.totalMarks}
    - Instructions: ${assignment.instructions}
    ${pdfContent ? '\nSource Material:\\n' + pdfContent : ''}
    
    Please group questions into distinct Sections (e.g., Section A, Section B).
    For each section, provide a title, instruction, and questions.
    Each question must have an id (string), text, difficulty (Easy, Moderate, or Hard), and marks.
    If the question is a Multiple Choice Question (MCQ), you MUST include an "options" array containing 4 string choices (e.g. A, B, C, D text).
    For EVERY question, provide a concise "answer" string containing the correct solution, explanation, or key points.
    Return ONLY a valid JSON array of Section objects matching the corresponding schema. Do NOT use markdown code blocks (\`\`\`json etc.). Return the raw JSON array.
    Ensure that the sum of marks equals exactly ${assignment.totalMarks} and the total number of questions is exactly ${assignment.numberOfQuestions}.
    
    JSON Schema:
    [
      {
        "title": "Section A - Multiple Choice",
        "instruction": "Attempt all questions",
        "questions": [
          {
            "id": "q1",
            "text": "What is ...?",
            "difficulty": "Easy",
            "marks": 2,
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "answer": "Option 2 is correct because..."
          }
        ]
      }
    ]
  `;
  
  if (!ai || !process.env.GEMINI_API_KEY) {
      await new Promise(res => setTimeout(res, 3000));
      
      const mockQuestions = Array.from({ length: assignment.numberOfQuestions }).map((_, i) => {
          // Distribute marks roughly
          const marksPerQuestion = Math.max(1, Math.floor(assignment.totalMarks / assignment.numberOfQuestions));
          return {
              id: (i + 1).toString(),
              text: `This is dynamically generated mock question ${i + 1} regarding ${assignment.title || 'the topic'}?`,
              difficulty: (i % 3 === 0 ? "Hard" : i % 2 === 0 ? "Moderate" : "Easy") as "Hard" | "Moderate" | "Easy",
              marks: marksPerQuestion
          };
      });

      return [
          {
              title: "Section A - Mock Generated Content",
              instruction: "Attempt all questions. (Note: No Gemini API Key was found so these are dummy questions to demonstrate the UI).",
              questions: mockQuestions
          }
      ];
  }

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
          responseMimeType: 'application/json'
      }
  });

  const text = response.text || "[]";
  try {
      const parsed = JSON.parse(text);
      return parsed as ISection[];
  } catch(e) {
      console.error("Failed to parse LLM JSON response", e);
      // fallback mock
      return [
        {
            title: "Fallback Section",
            instruction: "Generation Failed. See mock.",
            questions: [
                { id: "1", text: "Placeholder text?", difficulty: "Moderate", marks: assignment.totalMarks }
            ]
        }
      ];
  }
};
