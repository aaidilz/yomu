import { useEffect, useState } from "react";
import { ArrowBack, ArrowForward, Shuffle } from "@mui/icons-material";
import { motion } from "framer-motion";
import DictionaryService from "../../../services/DictionaryService";

const GameFlashcard = () => {
  interface Dictionary {
    id: string;
    hiragana: string;
    kanji: string;
    katakana: string;
    romaji: string;
    arti: string;
  }

  const [cards, setCards] = useState<Dictionary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    document.title = "Flashcard | Yomu";
  }, []);

  useEffect(() => {
    const fetchDictionaries = async () => {
      const userDictionaries = await DictionaryService.getUserDictionaries();
      setCards(userDictionaries);
    };

    fetchDictionaries();
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;

    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * cards.length));
    } else {
      setCurrentIndex(0);
    }

    setIsFlipped(false); // Reset flip saat kartu berganti
  }, [isRandom, cards]);

  const getRandomIndex = (currentIndex: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * cards.length);
    } while (newIndex === currentIndex); // Ensure the new index is different from the current index
    return newIndex;
  };

  const handleNext = () => {
    if (isRandom) {
      setCurrentIndex(getRandomIndex(currentIndex));
    } else if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (isRandom) {
      setCurrentIndex(getRandomIndex(currentIndex));
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setIsFlipped(false);
  };

  const handleShuffleToggle = () => {
    setIsRandom(!isRandom);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[#97C8EB] text-lg"
        >
          <div className="text-xl text-gray-500 mt-4">gak ada datanya :(</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-5">
      <div className="w-full max-w-2xl">
        {/* Card Counter */}
        <div className="text-center mb-6">
          <span className="bg-[#093A3E] text-[#64E9EE] px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Dictionary */}
        <div
          className="relative w-full max-w-[400px] h-[300px] mx-auto perspective-1000"
          onClick={handleFlip}
        >
          <motion.div
            className="w-full h-full absolute"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Side */}
            <div className="absolute w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl p-6 border-2 border-[#64E9EE]/30 backface-hidden shadow-2xl">
              <div className="text-[#64E9EE] text-5xl font-japanese mb-2">
                {cards[currentIndex].kanji || cards[currentIndex].hiragana}
              </div>
              {cards[currentIndex].hiragana && (
                <div className="text-[#97C8EB] text-lg">
                  {cards[currentIndex].hiragana}
                </div>
              )}
              <div className="absolute bottom-4 text-[#97C8EB]/50 text-sm">
                Tap to flip
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute w-full h-full flex items-center justify-center bg-gray-800 rounded-xl p-6 border-2 border-[#64E9EE]/30 backface-hidden transform rotate-y-180 shadow-2xl">
              <div className="text-[#64E9EE] text-3xl text-center">
                {cards[currentIndex].arti}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-3 text-[#97C8EB] hover:text-[#64E9EE] disabled:opacity-30 transition-all"
          >
            <ArrowBack className="text-3xl" />
          </button>

          <button
            onClick={handleShuffleToggle}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              isRandom
                ? "bg-[#13AAFB] text-white"
                : "border-2 border-[#64E9EE] text-[#64E9EE] hover:bg-[#64E9EE]/10"
            }`}
          >
            <Shuffle />
            <span>{isRandom ? "Ordered Mode" : "Shuffle Mode"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= cards.length - 1 && !isRandom}
            className="p-3 text-[#97C8EB] hover:text-[#64E9EE] disabled:opacity-30 transition-all"
          >
            <ArrowForward className="text-3xl" />
          </button>
        </div>

        {/* Indicator */}
        <div className="text-center mt-4 text-[#97C8EB]/50 text-sm">
          {isRandom ? "Random mode activated" : "Sequential mode"}
        </div>
      </div>
    </div>
  );
};

export default GameFlashcard;
