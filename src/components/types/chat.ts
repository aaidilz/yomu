export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  display?: boolean;
}