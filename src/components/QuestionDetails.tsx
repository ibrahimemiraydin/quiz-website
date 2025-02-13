// src/components/QuestionDetails.tsx
import React from 'react';

interface QuestionDetailsProps {
  question: {
    id: number;
    question: string;
    type: string;
    options: string[];
    answer: string;
  };
  selectedAnswers: { [key: number]: string };
  setSelectedAnswers: (answers: { [key: number]: string }) => void;
  showCorrectAnswers: boolean;
  isExamFinished: boolean;
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  question,
  selectedAnswers,
  setSelectedAnswers,
  showCorrectAnswers,
  isExamFinished
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isExamFinished) {
      setSelectedAnswers({
        ...selectedAnswers,
        [question.id]: event.target.value,
      });
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div>
      <h2 className="text-2xl mb-4">{question.question}</h2>
      {question.type === 'multiple_choice' ? (
        <div>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers[question.id] === option;
            const isCorrect = option === question.answer;
            const isWrong = isSelected && !isCorrect;
            const optionColor = showCorrectAnswers
              ? isCorrect
                ? 'bg-green-500 text-white'
                : isWrong
                ? 'bg-red-500 text-white'
                : 'bg-white text-black dark:bg-gray-800 dark:text-white'
              : isSelected
              ? 'bg-green-500 text-white'
              : 'bg-white text-black dark:bg-gray-800 dark:text-white';
            const borderColor = isSelected ? 'border-4 border-blue-500' : 'border';

            return (
              <div key={index} className="mb-2">
                <button
                  onClick={() => !isExamFinished && setSelectedAnswers({ ...selectedAnswers, [question.id]: option })}
                  className={`w-full px-4 py-2 rounded-lg flex items-center ${optionColor} ${borderColor}`}
                >
                  <span className="mr-2">{`${optionLabels[index]})`}</span>
                  <span>{option}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={selectedAnswers[question.id] || ''}
            onChange={handleChange}
            disabled={isExamFinished}
            className="form-input mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      )}
      {showCorrectAnswers && (
        <div className="mt-4">
          <strong>Doğru Cevap:</strong> {question.answer}
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
