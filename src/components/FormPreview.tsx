import React from 'react';
import { FormQuestion } from '../types';
import { Trash2, GripVertical } from 'lucide-react';

interface FormPreviewProps {
  title: string;
  description: string;
  questions: FormQuestion[];
  onQuestionDelete: (id: string) => void;
  onQuestionEdit: (id: string, updates: Partial<FormQuestion>) => void;
}

export function FormPreview({
  title,
  description,
  questions,
  onQuestionDelete,
  onQuestionEdit,
}: FormPreviewProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => onQuestionEdit('title', { title: e.target.value })}
          className="w-full text-2xl font-bold mb-2 px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="Form Title"
        />
        <textarea
          value={description}
          onChange={(e) => onQuestionEdit('description', { description: e.target.value })}
          className="w-full text-gray-600 px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Form Description"
        />
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="relative group bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-move">
              <GripVertical className="w-4 h-4" />
            </div>
            
            <div className="ml-6">
              <input
                type="text"
                value={question.title}
                onChange={(e) =>
                  onQuestionEdit(question.id, { title: e.target.value })
                }
                className="w-full font-medium mb-2 px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                placeholder="Question Title"
              />

              {question.type === 'text' && (
                <input
                  type="text"
                  disabled
                  placeholder="Short answer text"
                  className="w-full px-2 py-1 border border-gray-200 rounded bg-white opacity-50"
                />
              )}

              {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      {question.type === 'multipleChoice' ? (
                        <input type="radio" disabled />
                      ) : (
                        <input type="checkbox" disabled />
                      )}
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optionIndex] = e.target.value;
                          onQuestionEdit(question.id, { options: newOptions });
                        }}
                        className="flex-1 px-2 py-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'scale' && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">1</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    className="w-full"
                    disabled
                  />
                  <span className="text-sm text-gray-500">5</span>
                </div>
              )}
            </div>

            <button
              onClick={() => onQuestionDelete(question.id)}
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}