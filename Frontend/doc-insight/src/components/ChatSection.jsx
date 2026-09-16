import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../services/api";

function ChatSection({ selectedDocumentId }) {
  const [chatBox, setChatBox] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setChatBox(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const getChatHistory = async () => {
      if (!selectedDocumentId) {
        setMessages([]);
        return;
      }
      setMessages([]);

      try {
        const response = await api.get(`/chat-history/${selectedDocumentId}`);

        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    getChatHistory();
  }, [selectedDocumentId]);

  const handleSubmit = async () => {
    const question = chatBox.trim();

    if (!selectedDocumentId) {
      console.log("Please select a document");
      return;
    }

    if (!question) {
      console.log("Please enter a question");
      return;
    }

    if (isLoading) return;

    // Add user's question to chat immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setChatBox("");
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        documentId: selectedDocumentId,
        question,
      });

      console.log("Answer", response);

      const answer = response.data.answer;

      // Add backend answer to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error("Error answering question:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't answer that question.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="h-full text-white flex flex-col">
      <div className="px-10 pt-6 flex items-start justify-between">
        <div className="text-2xl font-bold">DocInsight</div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-[#212121] hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">
                  Welcome to DocInsight
                </h2>

                <p className="text-base text-gray-400 mb-6">
                  Upload your documents on the left and start asking questions
                  about them.
                </p>

                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-400 mb-2">Try asking</p>

                    <ul className="space-y-2 text-gray-400">
                      <li>Summarize the key points</li>
                      <li>What are the main topics?</li>
                      <li>Extract important dates or numbers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-base leading-7 ${
                      message.role === "user"
                        ? "bg-[#333333] text-white"
                        : "text-gray-200"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-5 py-3 text-base text-gray-400">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="px-10 pb-6 pt-3">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={chatBox}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            disabled={isLoading}
            placeholder="Ask a question about your document"
            className=" w-full h-14 px-5 pr-14 rounded-full border border-gray-700 bg-[#212121] text-white placeholder:text-gray-500
            focus:outline-none focus:border-gray-500 disabled:opacity-60"
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center
            justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <ArrowUpwardIcon fontSize="medium" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatSection;
