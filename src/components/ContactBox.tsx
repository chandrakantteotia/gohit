// src/components/ContactBox.tsx

import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import AskGohitChat from './AskGohitChat';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const ContactBox: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState('+919876543210');

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactInfo'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          let number = data.phone.toString().trim();
          number = number.replace(/[\s-]/g, '');
          if (!number.startsWith('+')) {
            number = '+91' + number.replace(/^0+/, '');
          }
          setWhatsAppNumber(number);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp number:', error);
      }
    };

    fetchPhone();
  }, []);

  const handleWhatsAppClick = () => {
    const message = "Hello! I'm interested in your construction services and available plots.";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsAppNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsContactOpen(!isContactOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full shadow-glow flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Need Help?</span>
      </button>

      {/* Dropdown Contact Options */}
      {isContactOpen && (
        <div className="fixed bottom-24 right-4 w-[92%] sm:w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 animate-fade-in-up transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">Let’s Connect</h3>
            <button
              onClick={() => setIsContactOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition"
              aria-label="Close contact box"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            {/* AskGohit Button */}
            <button
              onClick={() => {
                setIsContactOpen(false);
                setIsChatOpen(true);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with AskGohit
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-green-100 hover:bg-green-200 text-green-800 font-medium transition duration-200"
            >
              <Phone className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>

          <p className="text-[11px] text-gray-500 mt-4 text-right">⚡ Powered by Gohit</p>
        </div>
      )}

      {/* Chat Box Mount */}
      <AskGohitChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default ContactBox;
