import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useTheme } from "../../../contexts/ThemeContext";

interface Dictionary {
  id: string;
  hiragana: string;
  kanji: string;
  katakana: string;
  romaji: string;
  arti: string;
  kategori: string;
}

interface QuizQuestion {
  question: Dictionary;
  choices: string[];
}

interface MainGameQuizProps {
  quizQuestions: QuizQuestion[];
  currentIndex: number;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  isRandom: boolean;
  userAnswers: {[key: number]: {answer: string, isCorrect: boolean}};
  feedback: React.ReactNode;
  setFeedback: (feedback: React.ReactNode) => void;
  handleChoice: (selected: string) => void;
}

const MainGameQuiz: React.FC<MainGameQuizProps> = ({
  quizQuestions,
  currentIndex,
  setCurrentIndex,
  isRandom,
  userAnswers,
  feedback,
  setFeedback,
  handleChoice,
}) => {
  const { themeMode } = useTheme();
  const isLightMode = themeMode === 'light';

  const handleNext = () => {
    if (isRandom) {
      const randomIndex = Math.floor(Math.random() * quizQuestions.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, quizQuestions.length - 1));
    }
    setFeedback("");
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setFeedback("");
  };

  const getQuestionStatus = (index: number) => {
    if (userAnswers[index]) {
      return 'terjawab';
    }
    return 'belum dijawab';
  };

  const currentQuestionValue = quizQuestions[currentIndex].question.kanji || quizQuestions[currentIndex].question.hiragana;

  return (
    <>
      {!isRandom && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-4">
            <div className={`w-full rounded-full h-2 ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isLightMode ? 'bg-blue-600' : 'bg-[#64E9EE]'
                }`}
                style={{ width: `${(Object.keys(userAnswers).length / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
            <div className={`text-center text-sm mt-2 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
              Progress: {Object.keys(userAnswers).length}/{quizQuestions.length} jawaban terjawab
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 max-w-md mx-auto">
            {quizQuestions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setFeedback("");
                  }}
                  className={`w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
                    currentIndex === index
                      ? isLightMode
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-[#64E9EE] text-black ring-2 ring-[#64E9EE]/50'
                      : status === 'terjawab'
                        ? isLightMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#97C8EB] text-black'
                        : isLightMode
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className={`text-center mt-2 text-xs ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className={isLightMode ? 'text-blue-500' : 'text-[#97C8EB]'}>●</span> terjawab 
            <span className="mx-2 text-gray-400">●</span> belum dijawab
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`rounded-xl p-6 shadow-2xl border-2 ${
            isLightMode 
              ? 'bg-white border-blue-200' 
              : 'bg-gray-800 border-[#64E9EE]/30'
          }`}
        >
          {!isRandom && (
            <div className="text-center mb-4">
              <span className={`px-4 py-2 rounded-full text-sm ${
                isLightMode 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-[#093A3E] text-[#64E9EE]'
              }`}>
                {currentIndex + 1} / {quizQuestions.length}
              </span>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {currentQuestionValue && (
              <p className={`text-6xl font-bold text-center ${isLightMode ? 'text-gray-800' : 'text-white'}`}>
                <span className="ml-2">{currentQuestionValue || "なし"}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {quizQuestions[currentIndex].choices.map((choice, index) => {
              const isSelected = !isRandom && userAnswers[currentIndex]?.answer === choice;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 border-2 rounded-lg transition-all duration-200 active:scale-95 font-medium ${
                    isSelected
                      ? isLightMode
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-green-900/30 border-green-500 text-green-300'
                      : isLightMode 
                        ? 'border-blue-300 text-gray-700 hover:bg-blue-50' 
                        : 'border-[#97C8EB] text-white hover:bg-gray-700'
                  }`}
                  onClick={() => handleChoice(choice)}
                >
                  {choice}
                </motion.button>
              );
            })}
          </div>

          {feedback && (
            <div className="mt-6 text-center text-xl">{feedback}</div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6 max-w-md mx-auto">
        <button
          onClick={handlePrevious}
          disabled={!isRandom && currentIndex === 0}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
            isLightMode
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
              : 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
          }`}
        >
          <ArrowBack />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!isRandom && currentIndex === quizQuestions.length - 1}
          className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
            isLightMode
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
              : 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowForward />
        </button>
      </div>
    </>
  );
};

export default memo(MainGameQuiz);
