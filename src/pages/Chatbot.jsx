import Button from "../components/Button";
import { useEffect, useRef, useState } from "react";
import { getFitRxResponse } from "../utils/gemini";
import ReactMarkdown from 'react-markdown';

// Default system prompt — replace with your fuller FitRX system prompt if you have one.
const DEFAULT_SYSTEM_PROMPT = `You are FitRX, an expert AI fitness and nutrition assistant. Provide clear, safe, and actionable advice. Ask clarifying questions when needed. Keep responses concise and friendly.`;

const ChatbotScreen = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI fitness assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages update
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await getFitRxResponse(trimmed, DEFAULT_SYSTEM_PROMPT);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div ref={listRef} className="flex-grow space-y-4 overflow-y-auto mb-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                m.role === "assistant"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "bg-indigo-500 text-white"
              }`}
            >
              <p className="text-sm"><ReactMarkdown>{m.text}</ReactMarkdown></p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask me anything..."
          rows={1}
          className="flex-grow resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        />
        <Button onClick={send} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatbotScreen;
