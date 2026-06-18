import React from "react";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function ChatSection() {
  return (
    <div className="px-36 pt-6 h-full text-white text-2xl font-bold flex flex-col">
      DocInsight
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Welcome to DocInsight</h2>
          <p className="text-sm text-gray-400 mb-6">
            Upload your documents on the left and start asking questions about them.
          </p>
          <div className="space-y-3">
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-400 mb-2">Try asking</p>
              <ul className="space-y-1 text-gray-400">
                <li>Summarize the key points</li>
                <li>What are the main topics?</li>
                <li>Extract important dates or numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="text-base font-normal mb-8 relative">
        <input
          type="text"
          placeholder="Ask a question about your document"
          className="w-full p-4 pl-7 rounded-full border border-gray-600 bg-[#212121] text-white focus:outline-none focus:ring-1 focus:ring-[#333333]"
        />
        <button className="mr-1 absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowUpwardIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatSection;
