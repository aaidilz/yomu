import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DictionaryService from "../../../services/DictionaryService";
import { Shuffle } from "@mui/icons-material";
import { useTheme } from "../../../contexts/ThemeContext";
import MainGameQuiz from "./MainGameQuiz";

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

const GameQuizDashboard: React.FC = () => {
  const { themeMode } = useTheme();
  const isLightMode = themeMode === 'light';
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<React.ReactNode>("");
  const [isRandom, setIsRandom] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: {answer: string, isCorrect: boolean}}>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    document.title = "Quiz | Yomu";
  }, []);
  
  useEffect(() => {
    async function fetchData() {
      const data = await DictionaryService.getUserDictionaries();
      if (data.length === 0) return;

      const processedQuestions = data.map((question) => {
        const wrongChoices = data
          .filter((item) => item.id !== question.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((item) => item.arti);

        const allChoices = [...wrongChoices, question.arti].sort(
          () => 0.5 - Math.random()
        );
        return { question, choices: allChoices };
      });

      setQuizQuestions(processedQuestions);
      setCurrentIndex(0);
    }
    fetchData();
  }, []);

  const handleShuffleToggle = () => {
    setIsRandom(!isRandom);
    setFeedback("");
    setUserAnswers({});
    setShowResults(false);
    if (!isRandom) {
      setCurrentIndex(0);
    }
  };

  const handleChoice = (selected: string) => {
    if (!quizQuestions.length) return;
    const currentQuestion = quizQuestions[currentIndex].question;
    const isCorrect = selected === currentQuestion.arti;

    if (!isRandom) {
      setUserAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          answer: selected,
          isCorrect: isCorrect
        }
      }));
      
      setFeedback(
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-medium ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}
        >
          Tersimpan!
        </motion.div>
      );
    } else {
      if (isCorrect) {
        setFeedback(
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-bold ${isLightMode ? 'text-green-600' : 'text-green-400'}`}
          >
            Betul!
          </motion.div>
        );
      } else {
        setFeedback(
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={isLightMode ? 'text-red-600' : 'text-red-400'}
          >
            <p className="font-bold">Salah!</p>
            <p className="text-sm mt-2">Jawaban yang benar: {currentQuestion.arti}</p>
          </motion.div>
        );
      }
    }
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentIndex(0);
    setFeedback("");
  };

  const calculateScore = () => {
    if (quizQuestions.length === 0) return { correct: 0, total: 0, percentage: 0 };
    const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    return {
      correct: correctAnswers,
      total: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100)
    };
  };

  return (
    <div className={`min-h-screen flex items-center justify-center pt-20 ${isLightMode ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-[#64E9EE]'}`}>
      <div className="max-w-2xl w-full p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <h1 className={`text-3xl font-bold text-center ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE] neon-text'}`}>
            Quiz (Pilihan Ganda)
          </h1>

          <button
            onClick={handleShuffleToggle}
            className={`mt-4 px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              isRandom
                ? isLightMode 
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-[#13AAFB] text-white"
                : isLightMode
                  ? "border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                  : "border-2 border-[#64E9EE] text-[#64E9EE] hover:bg-[#64E9EE]/10"
            }`}
          >
            <Shuffle className="text-xl" />
            <span className="text-sm">
              {isRandom ? "Ordered Mode" : "Shuffle Mode"}
            </span>
          </button>

          <div className={`text-center mt-4 text-sm ${isLightMode ? 'text-gray-500' : 'text-[#97C8EB]/50'}`}>
            {isRandom ? "Random mode activated" : "Sequential mode"}
          </div>
        </motion.div>

        {quizQuestions.length > 0 ? (
          <>
            {showResults && !isRandom ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-6 shadow-2xl border-2 ${
                  isLightMode 
                    ? 'bg-white border-blue-200' 
                    : 'bg-gray-800 border-[#64E9EE]/30'
                }`}
              >
                <div className="text-center mb-6">
                  <h2 className={`text-2xl font-bold mb-4 ${isLightMode ? 'text-blue-600' : 'text-[#64E9EE]'}`}>
                    Quiz Results
                  </h2>
                  <div className={`text-4xl font-bold mb-2 ${
                    calculateScore().percentage >= 70 
                      ? 'text-green-500' 
                      : calculateScore().percentage >= 50 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                  }`}>
                    {calculateScore().percentage}%
                  </div>
                  <p className={`text-lg ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                    {calculateScore().correct} out of {calculateScore().total} correct
                  </p>
                </div>

                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {quizQuestions.map((question, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer?.isCorrect;
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrect
                            ? isLightMode
                              ? 'bg-green-50 border-green-200'
                              : 'bg-green-900/20 border-green-700'
                            : userAnswer
                              ? isLightMode
                                ? 'bg-red-50 border-red-200'
                                : 'bg-red-900/20 border-red-700'
                              : isLightMode
                                ? 'bg-gray-50 border-gray-200'
                                : 'bg-gray-700 border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isLightMode ? 'text-gray-800' : 'text-white'}`}>
                            Q{index + 1}: {question.question.kanji || question.question.hiragana}
                          </span>
                          <span className={`text-sm ${
                            isCorrect
                              ? 'text-green-600'
                              : userAnswer
                                ? 'text-red-600'
                                : 'text-gray-500'
                          }`}>
                            {isCorrect ? '✓' : userAnswer ? '✗' : '−'}
                          </span>
                        </div>
                        {userAnswer && (
                          <div className={`text-sm mt-1 ${isLightMode ? 'text-gray-600' : 'text-gray-300'}`}>
                            Your answer: {userAnswer.answer}
                            {!isCorrect && (
                              <span className="block">Correct: {question.question.arti}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleRestartQuiz}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      isLightMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-[#64E9EE] text-black hover:bg-[#64E9EE]/90'
                    }`}
                  >
                    Restart Quiz
                  </button>
                </div>
              </motion.div>
            ) : (
              <MainGameQuiz
                quizQuestions={quizQuestions}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isRandom={isRandom}
                userAnswers={userAnswers}
                feedback={feedback}
                setFeedback={setFeedback}
                handleChoice={handleChoice}
              />
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-8 text-center"
          >
            <div className={`text-xl mt-4 ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>gak ada datanya :(</div>
          </motion.div>
        )}
        
        {!isRandom && !showResults && quizQuestions.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleFinishQuiz}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isLightMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Selesai & Lihat Hasil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(GameQuizDashboard);
