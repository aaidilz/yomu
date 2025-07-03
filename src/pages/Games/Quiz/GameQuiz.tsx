import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DictionaryService from "../../../services/DictionaryService";
import { ArrowBack, ArrowForward, Shuffle } from "@mui/icons-material";
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

const GameQuiz: React.FC = () => {
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

  const handleShuffleToggle = () => {
    setIsRandom(!isRandom);
    setFeedback("");
    setUserAnswers({});
    setShowResults(false);
    if (!isRandom) {
      // Switching to random mode
      setCurrentIndex(0);
    }
  };

  const handleChoice = (selected: string) => {
    if (!quizQuestions.length) return;
    const currentQuestion = quizQuestions[currentIndex].question;
    const isCorrect = selected === currentQuestion.arti;

    // Track answer in ordered mode
    if (!isRandom) {
      setUserAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          answer: selected,
          isCorrect: isCorrect
        }
      }));
      
      // feedback
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
      // In random mode, still show immediate feedback
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
    const correctAnswers = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
    return {
      correct: correctAnswers,
      total: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100)
    };
  };

  const getQuestionStatus = (index: number) => {
    if (userAnswers[index]) {
      return 'terjawab';
    }
    return 'belum dijawab';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center pt-20 ${isLightMode ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-[#64E9EE]'}`}>
      <div className="max-w-2xl w-full">
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
            {/* Question Number Grid - Only in ordered mode */}
            {!isRandom && !showResults && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`}>
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

                {/* Question Number Grid */}
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

            {/* Results View */}
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

                {/* Detailed Results */}
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
                    {["kanji"].map((field) => {
                      const value =
                        quizQuestions[currentIndex].question[
                          field as keyof Dictionary
                        ];
                      return (
                        value && (
                          <p key={field} className={`text-6xl font-bold text-center ${
                            isLightMode ? 'text-gray-800' : 'text-white'
                          }`}>
                            <span className="ml-2">{value || "なし"}</span>
                          </p>
                        )
                      );
                    })}
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
            )}
          </>
        ) : quizQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-8 text-center"
          >
            <div className={`text-xl mt-4 ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>gak ada datanya :(</div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-8"
          >
            <div className={`h-48 rounded-xl animate-pulse ${isLightMode ? 'bg-gray-200' : 'bg-gray-700'}`}></div>
          </motion.div>
        )}

        {/* Controls */}
        {quizQuestions.length > 0 && !showResults && (
          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!isRandom && (
              <>
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`p-3 transition-all disabled:opacity-30 ${
                    isLightMode 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-[#97C8EB] hover:text-[#64E9EE]'
                  }`}
                >
                  <ArrowBack className="text-3xl" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= quizQuestions.length - 1}
                  className={`p-3 transition-all disabled:opacity-30 ${
                    isLightMode 
                      ? 'text-gray-600 hover:text-blue-600' 
                      : 'text-[#97C8EB] hover:text-[#64E9EE]'
                  }`}
                >
                  <ArrowForward className="text-3xl" />
                </button>

                {/* Finish Button - Show when at least some questions are answered */}
                {Object.keys(userAnswers).length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`ml-4 px-6 py-3 rounded-lg transition-all duration-200 font-bold ${
                      isLightMode 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    onClick={handleFinishQuiz}
                  >
                    Finish Quiz ({Object.keys(userAnswers).length}/{quizQuestions.length})
                  </motion.button>
                )}
              </>
            )}

            {isRandom && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg transition-all duration-200 border-2 font-bold ${
                  isLightMode 
                    ? 'bg-blue-100 hover:bg-blue-200 border-blue-500 text-blue-700' 
                    : 'bg-[#64E9EE] bg-opacity-20 hover:bg-opacity-30 border-[#64E9EE] text-black'
                }`}
                onClick={handleNext}
              >
                Next Question
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default memo(GameQuiz);
