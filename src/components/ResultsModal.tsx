// src/components/ResultsModal.tsx
import React from 'react';
import { IoClose } from 'react-icons/io5';

interface Props {
  score: { correct: number, incorrect: number, totalPoints: number };
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleShowCorrectAnswers: () => void;
}

const ResultsModal: React.FC<Props> = ({ score, setShowModal, handleShowCorrectAnswers }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-1/2 h-3/4 flex flex-col items-center justify-between">
        <div className="flex justify-between w-full mb-4">
          <h2 className="text-3xl font-bold text-center w-full">Sonuçlar</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-3xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="text-2xl flex items-center justify-center mb-4">
            <p className="mr-8">Doğru Sayısı: {score.correct}</p>
            <p>Yanlış Sayısı: {score.incorrect}</p>
          </div>
          <p className="text-lg">Toplam Puan: {score.totalPoints}</p>
        </div>
        <button
          onClick={handleShowCorrectAnswers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
        >
          Yanıtları Göster
        </button>
      </div>
    </div>
  );
};

export default ResultsModal;
