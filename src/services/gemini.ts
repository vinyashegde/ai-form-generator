import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBwXKpzS2syulUlt_OghvgoJkstPsRE70k');

export async function generateFormQuestions(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const systemPrompt = `Create a form based on this prompt. Return a JSON string with this structure:
  {
    "title": "Form title",
    "description": "Form description",
    "questions": [
      {
        "type": "text|multipleChoice|checkbox|scale",
        "title": "Question text",
        "required": boolean,
        "options": ["option1", "option2"] // Only for multipleChoice and checkbox
      }
    ]
  }`;

  const result = await model.generateContent([systemPrompt, prompt]);
  const response = await result.response;
  return response.text();
}