// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import QuestionDetails from '../components/QuestionDetails';
import QuestionList from '../components/QuestionList';
import ResultsModal from '../components/ResultsModal';
import CountdownTimer from '../components/CountdownTimer';

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
  answer: string;
  points: number;
}

const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch('/api/questions');
  const questions = await response.json();
  return questions;
};

const isCloseMatch = (userAnswer: string, correctAnswer: string, minWordMatch: number = 2): boolean => {
  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/[\W_]+/g, ' ').trim();
  };

  const userWords = normalizeString(userAnswer).split(' ');
  const correctWords = normalizeString(correctAnswer).split(' ');

  if (userWords.length === 1 && correctWords.length === 1) {
    return userWords[0] === correctWords[0];
  }

  const matchCount = correctWords.filter(word => userWords.includes(word)).length;
  return matchCount >= minWordMatch;
};

const Home: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, totalPoints: 0 });
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    const savedSelectedAnswers = localStorage.getItem('selectedAnswers');
    const savedSelectedQuestion = localStorage.getItem('selectedQuestion');
    const savedScore = localStorage.getItem('score');
    const savedShowCorrectAnswers = localStorage.getItem('showCorrectAnswers') === 'true';
    const savedShowResults = localStorage.getItem('showResults') === 'true';
    const savedTimerStarted = localStorage.getItem('timerStarted') === 'true';
    const savedTimerEnded = localStorage.getItem('timerEnded') === 'true';

    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      fetchQuestions().then(setQuestions);
    }

    if (savedSelectedAnswers) {
      setSelectedAnswers(JSON.parse(savedSelectedAnswers));
    }

    if (savedSelectedQuestion) {
      setSelectedQuestion(JSON.parse(savedSelectedQuestion));
    }

    if (savedScore) {
      setScore(JSON.parse(savedScore));
    }

    setShowCorrectAnswers(savedShowCorrectAnswers);
    setShowResults(savedShowResults);
    setTimerStarted(savedTimerStarted);
    setTimerEnded(savedTimerEnded);
    setIsExamFinished(savedShowResults);
  }, []);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    localStorage.setItem('selectedQuestion', JSON.stringify(selectedQuestion));
    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('showCorrectAnswers', showCorrectAnswers.toString());
    localStorage.setItem('showResults', showResults.toString());
    localStorage.setItem('timerStarted', timerStarted.toString());
    localStorage.setItem('timerEnded', timerEnded.toString());
    localStorage.setItem('isExamFinished', isExamFinished.toString());
  }, [questions, selectedAnswers, selectedQuestion, score, showCorrectAnswers, showResults, timerStarted, timerEnded, isExamFinished]);

  const handleFinishExam = () => {
    let correct = 0;
    let incorrect = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id] || '';
      const correctAnswer = question.answer;

      if (
        question.type === 'text'
          ? isCloseMatch(userAnswer, correctAnswer)
          : userAnswer === correctAnswer
      ) {
        correct++;
        totalPoints += question.points;
      } else {
        incorrect++;
      }
    });

    setScore({ correct, incorrect, totalPoints });
    setShowModal(true);
    setShowResults(false); // Sonuç modalinin tekrar açılmasını engellemek için
    setIsExamFinished(true);
  };

  const handleResetExam = () => {
    fetchQuestions().then(newQuestions => {
      setQuestions(newQuestions);
      setSelectedAnswers({});
      setSelectedQuestion(null);
      setShowCorrectAnswers(false);
      setShowModal(false);
      setShowResults(false);
      setTimerStarted(false);
      setTimerEnded(false);
      setIsExamFinished(false);

      localStorage.removeItem('selectedAnswers');
      localStorage.removeItem('selectedQuestion');
      localStorage.removeItem('score');
      localStorage.removeItem('showCorrectAnswers');
      localStorage.removeItem('showResults');
      localStorage.removeItem('timeLeft');
      localStorage.removeItem('timerStarted');
      localStorage.removeItem('timerEnded');
      localStorage.removeItem('isExamFinished');
      localStorage.setItem('questions', JSON.stringify(newQuestions));
    });
  };

  const handleShowCorrectAnswers = () => {
    setShowCorrectAnswers(true);
    setShowModal(false);
    setShowResults(true);
  };

  const handleStartTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    }
  };

  useEffect(() => {
    document.body.classList.add('dark');
  }, []);

  return (
    <div className="flex justify-center p-4 dark:bg-gray-900 dark:text-white h-screen">
      <QuestionList
        questions={questions}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={(question) => {
          setSelectedQuestion(question);
          handleStartTimer();
        }}
        selectedAnswers={selectedAnswers}
        showCorrectAnswers={showCorrectAnswers}
        handleFinishExam={handleFinishExam}
        handleResetExam={handleResetExam}
        isCloseMatch={isCloseMatch}
      />
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {selectedQuestion ? (
          <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <QuestionDetails
              question={selectedQuestion}
              selectedAnswers={selectedAnswers}
              setSelectedAnswers={setSelectedAnswers}
              showCorrectAnswers={showCorrectAnswers}
              isExamFinished={isExamFinished}
            />
          </div>
        ) : (
          <div
            className="p-4 text-center text-black dark:text-white cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            onClick={() => {
              setSelectedQuestion(questions.find(q => q.id === 1) || null);
              handleStartTimer();
            }}
          >
            Sınavı Başlat
          </div>
        )}
      </div>

      {timerStarted && !timerEnded && (
        <CountdownTimer
          duration={600} // Örnek olarak 10 dakika (600 saniye)
          onTimeUp={() => {
            handleFinishExam();
            setShowModal(true); // Modalı süre dolduğunda açmak için
            setShowResults(false);
          }}
          timerStarted={timerStarted}
          setTimerEnded={setTimerEnded}
        />
      )}

      {showModal && (
        <ResultsModal
          score={score}
          setShowModal={setShowModal}
          handleShowCorrectAnswers={handleShowCorrectAnswers}
        />
      )}

      {showResults && (
              <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-lg">Doğru Sayısı: {score.correct}</p>
                <p className="text-lg">Yanlış Sayısı: {score.incorrect}</p>
                <p className="text-lg">Toplam Puan: {score.totalPoints}</p>
              </div>
            )}
          </div>
        );
      };

      export default Home;
