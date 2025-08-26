import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AssistantIcon from "@mui/icons-material/Assistant";

interface ChatHeaderProps {
  isLightMode: boolean;
  onClear: () => void;
  onClose: () => void;
}

const ChatHeader = ({ isLightMode, onClear, onClose }: ChatHeaderProps) => (
  <div className={`flex items-center justify-between ${isLightMode ? 'bg-white border-b border-gray-200 text-gray-800' : 'bg-gray-900 text-white'} p-3`}>
    <div className="flex items-center">
      <AssistantIcon className="mr-2" />
      <span className="font-bold">AI Assistant</span>
    </div>
    <div className="flex space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClear}
        className={`p-1 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-200' : 'hover:bg-gray-500'}`}
        title="Clear chat"
      >
        <DeleteIcon fontSize="small" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className={`p-1 rounded-full transition-colors ${isLightMode ? 'hover:bg-gray-200' : 'hover:bg-gray-500'}`}
      >
        <CloseIcon fontSize="small" />
      </motion.button>
    </div>
  </div>
);

export default ChatHeader;
