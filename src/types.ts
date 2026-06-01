export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctAnswerId: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}
