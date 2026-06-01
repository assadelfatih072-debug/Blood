import { useState } from "react";
import { Activity, Stethoscope, ArrowRight, ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { quizCategories } from "./data";
import { QuizCategory, Question } from "./types";

export default function App() {
  const [activeQuiz, setActiveQuiz] = useState<QuizCategory | null>(null);

  if (!activeQuiz) {
    return <QuizSelection onSelect={setActiveQuiz} />;
  }

  return (
    <QuizSession 
      quiz={activeQuiz} 
      onExit={() => setActiveQuiz(null)} 
    />
  );
}

function QuizSelection({ onSelect }: { onSelect: (quiz: QuizCategory) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pt-16 px-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-sans font-bold tracking-tight mb-4">Medical Sciences Quiz</h1>
          <p className="text-slate-500 text-lg">Test your knowledge with these comprehensive practice sets.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelect(category)}
              className="text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-105 transition-transform">
                {category.icon === 'Activity' ? <Activity size={28} /> : <Stethoscope size={28} />}
              </div>
              <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
              <p className="text-slate-500 mb-6 text-sm">{category.description}</p>
              
              <div className="flex items-center text-indigo-600 font-medium text-sm">
                <span>Start Quiz ({category.questions.length} questions)</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizSession({ quiz, onExit }: { quiz: QuizCategory; onExit: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted || answers[currentQuestionIndex]) return;
    setAnswers({ ...answers, [currentQuestionIndex]: optionId });
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerId) score++;
    });
    return score;
  };

  if (isSubmitted) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <div className="text-6xl font-black text-indigo-600 tracking-tighter mb-2">
            {percentage}%
          </div>
          <p className="text-slate-500 mb-8">You scored {score} out of {quiz.questions.length} correct.</p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setAnswers({});
                setCurrentQuestionIndex(0);
                setIsSubmitted(false);
              }}
              className="flex items-center px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
            >
              <RotateCcw size={18} className="mr-2" />
              Retake Quiz
            </button>
            <button 
              onClick={onExit}
              className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Main Menu
            </button>
          </div>
        </div>

        <div className="max-w-3xl w-full space-y-6">
          <h3 className="text-xl font-bold mb-4">Detailed Review</h3>
          {quiz.questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctAnswerId;
            const isUnanswered = userAnswer === undefined;

            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle className="text-emerald-500" size={24} />
                    ) : (
                      <XCircle className="text-rose-500" size={24} />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-400 block mb-1">Question {index + 1}</span>
                    <p className="text-lg font-medium text-slate-800">{q.text}</p>
                  </div>
                </div>

                <div className="pl-10 space-y-2">
                  {q.options.map(opt => {
                    const isSelected = userAnswer === opt.id;
                    const isActualCorrect = q.correctAnswerId === opt.id;
                    
                    let bgClass = "bg-slate-50 border-slate-200 text-slate-600";
                    if (isActualCorrect) {
                      bgClass = "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium";
                    } else if (isSelected && !isActualCorrect) {
                      bgClass = "bg-rose-50 border-rose-200 text-rose-800";
                    }

                    return (
                      <div key={opt.id} className={`px-4 py-3 border rounded-lg flex items-center justify-between ${bgClass}`}>
                        <div className="flex items-center">
                          <span className="w-6 font-mono text-sm opacity-50">{opt.id}.</span>
                          <span>{opt.text}</span>
                        </div>
                        {isSelected && !isActualCorrect && <XCircle size={16} className="text-rose-500" />}
                        {isActualCorrect && isSelected && <CheckCircle size={16} className="text-emerald-600" />}
                        {isActualCorrect && !isSelected && <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Correct Answer</span>}
                      </div>
                    );
                  })}
                  {isUnanswered && (
                    <p className="text-sm text-amber-600 font-medium mt-2">You skipped this question.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" onClick={onExit}>
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Exit Quiz</span>
        </div>
        <div className="font-mono text-sm tracking-wide text-slate-500">
          {currentQuestionIndex + 1} / {quiz.questions.length}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24 max-w-3xl mx-auto w-full">
        <div className="w-full">
          <h2 className="text-3xl font-medium text-slate-900 leading-tight mb-10">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selectedAnswerId = answers[currentQuestionIndex];
              const isSelected = selectedAnswerId === option.id;
              const isAnswered = selectedAnswerId !== undefined;
              const isCorrectOption = option.id === currentQuestion.correctAnswerId;
              
              let buttonClass = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';
              let iconClass = 'border-slate-300 text-slate-500';
              let textClass = 'text-slate-700';

              if (isAnswered) {
                if (isCorrectOption) {
                  buttonClass = 'border-emerald-500 bg-emerald-50/50';
                  iconClass = 'border-emerald-500 bg-emerald-500 text-white';
                  textClass = 'text-emerald-900 font-medium';
                } else if (isSelected) {
                  buttonClass = 'border-rose-500 bg-rose-50/50';
                  iconClass = 'border-rose-500 bg-rose-500 text-white';
                  textClass = 'text-rose-900 font-medium';
                } else {
                  buttonClass = 'border-slate-200 bg-white opacity-50';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center ${buttonClass}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${iconClass}`}>
                    <span className="font-mono font-medium text-sm">{option.id}</span>
                  </div>
                  <span className={`text-lg ${textClass}`}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {answers[currentQuestionIndex] && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300 text-center">
              {answers[currentQuestionIndex] === currentQuestion.correctAnswerId ? (
                <p className="text-4xl font-extrabold text-emerald-500 drop-shadow-sm">شتت✌️</p>
              ) : (
                <p className="text-4xl font-bold text-rose-500 drop-shadow-sm">بالزوق بس 🥲</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-slate-200 fixed bottom-0 w-full p-4 px-6 md:px-12 flex justify-between items-center z-10">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            onClick={() => setIsSubmitted(true)}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
            className="flex items-center px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 shadow-sm transition-all animate-in fade-in"
          >
            Next
            <ArrowRight size={18} className="ml-2" />
          </button>
        )}
      </footer>
    </div>
  );
}
