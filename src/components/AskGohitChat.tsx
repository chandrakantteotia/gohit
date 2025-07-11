import React, { useState, useEffect, useRef } from 'react';
import { sendToGemini } from '../utils/geminiApi';
import { X, Send } from 'lucide-react';
import Img from '../assets/favicionicon.png'

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AskGohitChat: React.FC<Props> = ({ isOpen, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('gohit-chat');
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('gohit-chat', JSON.stringify(messages));
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const now = new Date().toLocaleTimeString();
      setMessages([
        { sender: 'ai', text: '👋 Welcome to Gohit Properties!', time: now },
        { sender: 'ai', text: 'How may I assist you today regarding properties?', time: now },
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const time = new Date().toLocaleTimeString();
    const message = userInput.trim();

    setMessages((prev) => [...prev, { sender: 'user', text: message, time }]);
    setUserInput('');
    setIsLoading(true);

    const reply = await sendToGemini(message);
    setMessages((prev) => [...prev, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString() }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 w-[92vw] sm:w-96 h-[75vh] sm:h-[70vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden border border-gray-300 animate-fadeIn">
      
      {/* Header with logo and close */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 font-semibold text-base shadow flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={Img} 
            alt="Gohit Logo"
            className="h-8 w-9 rounded-full object-contain"
          />
          <span>AskGohit – Property Assistant</span>
        </div>
        <button onClick={onClose} aria-label="Close chat">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 p-3 space-y-3 overflow-y-auto bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-blue-300"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] whitespace-pre-line leading-snug shadow-sm transform transition duration-200
              ${msg.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200'}`}
            >
              <div>{msg.text}</div>
              <div className="text-[10px] text-gray-500 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400 text-xs animate-pulse">AskGohit is typing...</div>}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about a property..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-transform duration-200 hover:scale-105"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AskGohitChat;
