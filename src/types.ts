export interface FormQuestion {
  id: string;
  type: 'text' | 'multipleChoice' | 'checkbox' | 'scale';
  title: string;
  required: boolean;
  options?: string[];
}

export interface GeneratedForm {
  title: string;
  description: string;
  questions: FormQuestion[];
}