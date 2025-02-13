// src/components/QuestionList.tsx
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
  answer: string;
  points: number;
}

interface Props {
  questions: Question[];
  selectedQuestion: Question | null;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  selectedAnswers: { [key: number]: string };
  showCorrectAnswers: boolean;
  handleFinishExam: () => void;
  handleResetExam: () => void;
  isCloseMatch: (userAnswer: string, correctAnswer: string, minWordMatch?: number) => boolean;
}

const QuestionList: React.FC<Props> = ({
  questions,
  selectedQuestion,
  setSelectedQuestion,
  selectedAnswers,
  showCorrectAnswers,
  handleFinishExam,
  handleResetExam,
  isCloseMatch
}) => {
  return (
    <div className="w-1/4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 text-center text-black dark:text-white">Sorular</h3>
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li
              key={question.id}
              onClick={() => setSelectedQuestion(question)}
              className={`flex justify-between items-center cursor-pointer p-2 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 ${selectedQuestion && selectedQuestion.id === question.id ? 'bg-blue-500 text-white' : ''}`}
            >
              <span>{index + 1}. Soru</span>
              {showCorrectAnswers && (
                <div className="flex items-center">
                  <span className="mr-2">{question.points}P</span>
                  {question.type === 'text'
                    ? (selectedAnswers[question.id] && isCloseMatch(selectedAnswers[question.id], question.answer)
                      ? <FaCheck className="text-green-500" />
                      : <FaTimes className="text-red-500" />)
                    : (selectedAnswers[question.id] === question.answer
                      ? <FaCheck className="text-green-500" />
                      : <FaTimes className="text-red-500" />)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleResetExam}
          className="px-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <AiOutlineReload size={24} />
        </button>
        <button
          onClick={handleFinishExam}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
        >
          Sınavı Bitir
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
