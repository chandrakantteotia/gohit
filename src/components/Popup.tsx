import React, { useEffect, useState } from 'react';
import Img from '../assets/favicionicon.png';
import AskGohitChat from './AskGohitChat';
import { MessageCircle, ArrowRight, ArrowLeft, Image } from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // ✅ Firestore import
import app from '../firebase/config';

const Popup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const db = getFirestore(app); // ✅ Firestore instance

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Fetch images from Firestore (uploadedImages collection)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posters'));
        const urls: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data?.image) urls.push(data.image);

        });
        setImages(urls.reverse()); // latest image first
      } catch (error) {
        console.error("Error fetching Firestore image URLs:", error);
      }
    };

    fetchImages();
  }, []);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (!show) return;
    const autoSlide = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(autoSlide);
  }, [show]);

  const handleChatNow = () => {
    setIsChatOpen(true);
    setShow(false);
  };

  const handleNext = () => setSlideIndex((prev) => (prev + 1) % 2);
  const handlePrev = () => setSlideIndex((prev) => (prev - 1 + 2) % 2);

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-3">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[60vh] sm:max-h-[73vh] h-[55vh] sm:h-auto p-4 sm:p-6 relative animate-fadeIn overflow-hidden flex flex-col">

            {/* Close Button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
            >
              &times;
            </button>

            {/* Title */}
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                {slideIndex === 0 ? '👋 Meet Your Smart Assistant' : '📸 Latest Updates'}
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 sm:pr-2">
              {/* Slide 1 */}
              {slideIndex === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={Img}
                      alt="AskGohit Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">Welcome to AskGohit!</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Your trusted property assistant — available 24/7.
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    Need help exploring properties, checking price trends, or legal documentation?
                    Our assistant helps you buy, rent, or sell with ease.
                  </p>

                  <ul className="text-gray-600 text-sm list-disc pl-5 space-y-1">
                    <li>Verified listings with price insights</li>
                    <li>Ask questions freely, no forms required</li>
                    <li>Rental & purchase assistance</li>
                    <li>Fast & human-like replies</li>
                  </ul>

                  <button
                    onClick={handleChatNow}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all duration-200"
                  >
                    <MessageCircle className="inline mr-2" />
                    Chat Now with AskGohit
                  </button>
                </div>
              )}

              {/* Slide 2 - Image Gallery */}
              {slideIndex === 1 && (
                <div className="flex justify-center items-center w-full max-h-[60vh] sm:max-h-[73vh]">
                  {images.length > 0 ? (
                    <div className="w-full h-full">
                      <img
                        src={images[0]}
                        alt="Latest Property"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/500x300?text=Error';
                        }}
                        className="w-full h-full object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-sm text-gray-500 w-full h-full">
                      <Image size={36} className="mb-2" />
                      No property images uploaded yet.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Arrows */}
            <div className="flex justify-center gap-6 items-center pt-3">
              <button
                onClick={handlePrev}
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
              >
                <ArrowLeft size={26} />
              </button>
              <span className="text-sm text-gray-500">
                {slideIndex === 0 ? 'Assistant Info' : 'Image Gallery'}
              </span>
              <button
                onClick={handleNext}
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
              >
                <ArrowRight size={26} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Component */}
      {isChatOpen && (
        <AskGohitChat isOpen={true} onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
};

export default Popup;
