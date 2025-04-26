import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DictionaryService from "../../../services/DictionaryService";
import { ArrowBack, ArrowForward, Shuffle } from "@mui/icons-material";

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
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<React.ReactNode>("");
  const [isRandom, setIsRandom] = useState(false);

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
  };

  const handleChoice = (selected: string) => {
    if (!quizQuestions.length) return;
    const currentQuestion = quizQuestions[currentIndex].question;

    if (selected === currentQuestion.arti) {
      setFeedback(
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-green-400"
        >
          Benar!
        </motion.div>
      );
    } else {
      setFeedback(
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400"
        >
          <p className="font-bold">Salah!</p>
          <p className="text-sm mt-2">Jawaban benar: {currentQuestion.arti}</p>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-5 text-[#64E9EE]">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-center neon-text">
            Quiz (Pilihan Ganda)
          </h1>

          <button
            onClick={handleShuffleToggle}
            className={`mt-4 px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              isRandom
                ? "bg-[#13AAFB] text-white"
                : "border-2 border-[#64E9EE] text-[#64E9EE] hover:bg-[#64E9EE]/10"
            }`}
          >
            <Shuffle className="text-xl" />
            <span className="text-sm">
              {isRandom ? "Ordered Mode" : "Shuffle Mode"}
            </span>
          </button>

          <div className="text-center mt-4 text-[#97C8EB]/50 text-sm">
            {isRandom ? "Random mode activated" : "Sequential mode"}
          </div>
        </motion.div>

        {quizQuestions.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 shadow-2xl border-2 border-[#64E9EE]/30"
            >
              {!isRandom && (
                <div className="text-center mb-4">
                  <span className="bg-[#093A3E] text-[#64E9EE] px-4 py-2 rounded-full text-sm">
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
                      <p key={field} className="text-6xl font-bold text-center">
                        <span className="ml-2">{value || "なし"}</span>
                      </p>
                    )
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quizQuestions[currentIndex].choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-3 border-2 border-[#97C8EB] rounded-lg 
              hover:bg-gray-700 transition-all duration-200
              active:scale-95 font-medium"
                    onClick={() => handleChoice(choice)}
                  >
                    {choice}
                  </motion.button>
                ))}
              </div>

              {feedback && (
                <div className="mt-6 text-center text-xl">{feedback}</div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : quizQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-8 text-center"
          >
            <div className="text-xl text-gray-500 mt-4">gak ada datanya :(</div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 gap-8"
          >
            <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
          </motion.div>
        )}

        {/* Controls */}
        {quizQuestions.length > 0 && (
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
                  className="p-3 text-[#97C8EB] hover:text-[#64E9EE] disabled:opacity-30 transition-all"
                >
                  <ArrowBack className="text-3xl" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= quizQuestions.length - 1}
                  className="p-3 text-[#97C8EB] hover:text-[#64E9EE] disabled:opacity-30 transition-all"
                >
                  <ArrowForward className="text-3xl" />
                </button>
              </>
            )}

            {isRandom && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#64E9EE] bg-opacity-20 rounded-lg
            hover:bg-opacity-30 transition-all duration-200
            border-2 border-[#64E9EE] font-bold text-black"
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
