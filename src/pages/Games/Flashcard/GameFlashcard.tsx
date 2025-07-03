import { useEffect, useState } from "react";
import { ArrowBack, ArrowForward, Shuffle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import DictionaryService from "../../../services/DictionaryService";
import { useTheme } from "../../../contexts/ThemeContext";

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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isAnimating, setIsAnimating] = useState(false);
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";

  // Swipe threshold and animation variants
  const swipeConfidenceThreshold = 10000;

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
    if (isAnimating) return;
    setDirection(1);
    navigateCard(1);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setDirection(-1);
    navigateCard(-1);
  };

  const navigateCard = (dir: number) => {
    if (isRandom) {
      setCurrentIndex(getRandomIndex(currentIndex));
    } else {
      if (dir === 1 && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (dir === -1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    setIsFlipped(false);
  };

  // Swipe detection functions
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (_: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      // Swipe left - go to next card
      setDirection(1);
      navigateCard(1);
    } else if (swipe > swipeConfidenceThreshold) {
      // Swipe right - go to previous card
      setDirection(-1);
      navigateCard(-1);
    }
  };

  const handleShuffleToggle = () => {
    setIsRandom(!isRandom);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLightMode ? 'bg-gray-50' : 'bg-gray-900'
      }`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={isLightMode ? 'text-gray-600 text-lg' : 'text-[#97C8EB] text-lg'}
        >
          <div className={`text-xl mt-4 ${isLightMode ? 'text-gray-500' : 'text-gray-500'}`}>gak ada datanya :(</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 mt-5 ${
      isLightMode ? 'bg-gray-50' : 'bg-gray-900'
    }`}>
      <div className="w-full max-w-2xl">
        {/* Card Counter */}
        <div className="text-center mb-6">
          <span className={`px-4 py-2 rounded-full text-sm ${
            isLightMode 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-[#093A3E] text-[#64E9EE]'
          }`}>
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        {/* Dictionary Card with Swipe */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ 
              x: direction > 0 ? 300 : -300, 
              opacity: 0,
              scale: 0.8
            }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              x: direction > 0 ? -300 : 300, 
              opacity: 0,
              scale: 0.8
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            className="relative w-full max-w-[400px] h-[300px] mx-auto perspective-1000 cursor-pointer"
            onClick={handleFlip}
            whileDrag={{ scale: 1.05 }}
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
              <div className={`absolute w-full h-full flex flex-col items-center justify-center rounded-xl p-6 border-2 backface-hidden shadow-2xl ${
                isLightMode 
                  ? 'bg-white border-blue-300' 
                  : 'bg-gray-800 border-[#64E9EE]/30'
              }`}>
                <div className={`text-5xl font-japanese mb-2 ${
                  isLightMode ? 'font-medium' : 'text-[#64E9EE]'
                }`}>
                  {cards[currentIndex].kanji || cards[currentIndex].hiragana}
                </div>
                {cards[currentIndex].hiragana && (
                  <div className={`text-lg ${
                    isLightMode ? 'font-medium' : 'text-[#97C8EB]'
                  }`}>
                    {cards[currentIndex].hiragana}
                  </div>
                )}
                <div className={`absolute bottom-4 text-xs ${
                  isLightMode ? 'text-gray-400' : 'text-[#97C8EB]/50'
                }`}>
                  Tap to flip • Swipe to navigate
                </div>
              </div>

              {/* Back Side */}
              <div className={`absolute w-full h-full flex items-center justify-center rounded-xl p-6 border-2 backface-hidden transform rotate-y-180 shadow-2xl ${
                isLightMode 
                  ? 'bg-white border-blue-300' 
                  : 'bg-gray-800 border-[#64E9EE]/30'
              }`}>
                <div className={`text-3xl text-center ${
                  isLightMode ? 'text-normal' : 'text-[#64E9EE]'
                }`}>
                  {cards[currentIndex].arti}
                </div>
                <div className={`absolute bottom-4 text-xs ${
                  isLightMode ? 'text-gray-400' : 'text-[#97C8EB]/50'
                }`}>
                  Tap to flip • Swipe to navigate
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>  

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`p-3 disabled:opacity-30 transition-all ${
              isLightMode 
                ? 'text-blue-500 hover:text-blue-700' 
                : 'text-[#97C8EB] hover:text-[#64E9EE]'
            }`}
          >
            <ArrowBack className="text-3xl" />
          </button>

          <button
            onClick={handleShuffleToggle}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              isRandom
                ? (isLightMode 
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-[#13AAFB] text-white")
                : (isLightMode
                    ? "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    : "border-2 border-[#64E9EE] text-[#64E9EE] hover:bg-[#64E9EE]/10")
            }`}
          >
            <Shuffle />
            <span>{isRandom ? "Ordered Mode" : "Shuffle Mode"}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= cards.length - 1 && !isRandom}
            className={`p-3 disabled:opacity-30 transition-all ${
              isLightMode 
                ? 'text-blue-500 hover:text-blue-700' 
                : 'text-[#97C8EB] hover:text-[#64E9EE]'
            }`}
          >
            <ArrowForward className="text-3xl" />
          </button>
        </div>

        {/* Indicator */}
        <div className={`text-center mt-4 text-sm ${
          isLightMode ? 'text-gray-400' : 'text-[#97C8EB]/50'
        }`}>
          {isRandom ? "Random mode activated" : "Sequential mode"}
        </div>
      </div>
    </div>
  );
};

export default GameFlashcard;
