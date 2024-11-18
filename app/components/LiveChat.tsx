"use client";

import { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#FCC502] p-4 flex justify-between items-center">
            <h3 className="text-black font-semibold">Live Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-gray-800 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow p-4 bg-gray-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="bg-[#FCC502]/10 rounded-lg p-3 max-w-[80%] self-start">
                  <p className="text-sm">Hello! How can we help you today?</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">Support Team</span>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FCC502]"
              />
              <button className="bg-[#FCC502] text-black px-4 py-2 rounded-lg hover:bg-[#FCC502]/90 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#FCC502] text-black p-4 rounded-full shadow-lg hover:bg-[#FCC502]/90 transition-all hover:scale-105"
      >
        <FaComments className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LiveChat;
