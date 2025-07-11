// src/components/WhatsAppButton.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactInfo'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          if (data.phone) {
            let number = data.phone.toString().trim();
            number = number.replace(/[\s-]/g, '');
            if (!number.startsWith('+')) {
              number = '+91' + number.replace(/^0+/, '');
            }
            setPhoneNumber(number);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching WhatsApp number:', error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const message = "Hello! I'm interested in your construction services and available plots. Please provide more information.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Glowing Rings */}
      <div className="absolute -inset-1 rounded-full bg-green-400 opacity-30 animate-[wave1_2s_infinite] blur-sm z-[-1]" />
      <div className="absolute -inset-2 rounded-full bg-green-400 opacity-20 animate-[wave2_3s_infinite] blur-md z-[-2]" />

      {/* Main Button */}
      <button
        onClick={handleWhatsAppClick}
        className="relative flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none"
      >
        <MessageCircle className="h-6 w-6 animate-pulse" />
        <span className="font-semibold hidden sm:inline">Chat on WhatsApp</span>
      </button>

      {/* Tooltip */}
      <span className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        Message us instantly!
      </span>

      {/* Keyframes */}
      <style>
        {`
          @keyframes wave1 {
            0%, 100% {
              transform: scale(0.95);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
          }
          @keyframes wave2 {
            0%, 100% {
              transform: scale(0.95);
              opacity: 0.4;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.2;
            }
          }
        `}
      </style>
    </div>
  );
};

export default WhatsAppButton;
