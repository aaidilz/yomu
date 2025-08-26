import { motion } from "framer-motion";
import Swal from "sweetalert2";
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
            <span className="font-bold">Assistant</span>
        </div>
        <div className="flex space-x-2">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    Swal.fire({
                        title: "Hapus chat?",
                        text: "Ini akan menghapus semua pesan dalam obrolan ini.",
                        icon: "warning",
                        showCancelButton: true,
                        background: isLightMode ? "#ffffff" : "#0f172a",
                        color: isLightMode ? "#1e293b" : "#fff",
                        confirmButtonText: "Ya, hapus",
                        cancelButtonText: "Batal"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            onClear();
                        }
                    });
                }}
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
