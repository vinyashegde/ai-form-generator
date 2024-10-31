import React, { useState, useEffect } from 'react';
import { PromptInput } from './components/PromptInput';
import { FormPreview } from './components/FormPreview';
import { FormQuestion, GeneratedForm } from './types';
import { FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { generateFormQuestions } from './services/gemini';
import { initializeGoogleAPI, initializeGIS, createGoogleForm } from './services/google-forms';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<GeneratedForm | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const initAPIs = async () => {
      try {
        await Promise.all([initializeGoogleAPI(), initializeGIS()]);
      } catch (error) {
        toast.error('Failed to initialize Google APIs');
      }
    };
    initAPIs();
  }, []);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await generateFormQuestions(prompt);
      const formData = JSON.parse(response);
      
      // Add unique IDs to questions
      formData.questions = formData.questions.map((q: any, index: number) => ({
        ...q,
        id: `q${index + 1}`,
      }));
      
      setGeneratedForm(formData);
      toast.success('Form generated successfully!');
    } catch (error) {
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedForm) return;
    
    setIsPublishing(true);
    try {
      const formUrl = await createGoogleForm(generatedForm);
      toast.success(
        <div>
          Form published! <a href={formUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open form</a>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error('Failed to publish form. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleQuestionDelete = (id: string) => {
    if (!generatedForm) return;
    setGeneratedForm({
      ...generatedForm,
      questions: generatedForm.questions.filter(q => q.id !== id)
    });
  };

  const handleQuestionEdit = (id: string, updates: Partial<FormQuestion>) => {
    if (!generatedForm) return;
    setGeneratedForm({
      ...generatedForm,
      questions: generatedForm.questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      )
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Form Generator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Generate professional forms instantly using AI
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
          
          {generatedForm && (
            <>
              <FormPreview
                title={generatedForm.title}
                description={generatedForm.description}
                questions={generatedForm.questions}
                onQuestionDelete={handleQuestionDelete}
                onQuestionEdit={handleQuestionEdit}
              />
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPublishing ? 'Publishing...' : 'Publish to Google Forms'}
              </button>
            </>
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;