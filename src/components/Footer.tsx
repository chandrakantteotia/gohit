import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Phone, Mail, Facebook, Instagram, Linkedin, Youtube, MessageSquareText
} from 'lucide-react';
import Img from '../assets/footerLogo.png';

const Footer: React.FC = () => {
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '' });
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [footerInfo, setFooterInfo] = useState<{ owner?: string; engineer?: string }>({});

  // Fetch contact info & footer info from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactSnap = await getDocs(collection(db, 'contactInfo'));
        if (!contactSnap.empty) {
          const data = contactSnap.docs[0].data();
          setContactInfo({
            phone: data.phone || '',
            email: data.email || '',
          });
        }

        const footerSnap = await getDocs(collection(db, 'footerInfo'));
        if (!footerSnap.empty) {
          const data = footerSnap.docs[0].data();
          // console.log("Fetched footer data:", data);

          setFooterInfo({
  owner: data.ownerName || '',
  engineer: data.engineerName || '',
});

        }
      } catch (error) {
        console.error('Error fetching footer info:', error);
      }
    };

    fetchData();
  }, []);

  const phoneLink = `tel:${contactInfo.phone || '+919876543210'}`;
  const emailLink = `mailto:${contactInfo.email || 'info@civilpro.com'}`;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      const q = query(collection(db, 'subscribers'), where("email", "==", emailInput.toLowerCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMessage({ type: 'error', text: 'You are already subscribed!' });
      } else {
        await addDoc(collection(db, 'subscribers'), {
          email: emailInput.toLowerCase(),
          subscribedAt: new Date()
        });
        setMessage({ type: 'success', text: 'Thanks for subscribing!' });
        setEmailInput('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' });
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mt-0">
              <img height={0} width={140} src={Img} alt="Footer Logo" />
            </div>
            <p className="text-gray-300 mb-4 mt-2">
              Professional civil engineering services for construction, design, and real estate development.
              Building dreams with precision and quality.
            </p>

            {footerInfo.owner && (
              <p className="text-white-500 text-sm mt-1">
                Owner: <span className="text-gray-500 font-semibold">{footerInfo.owner}</span>
              </p>
            )}
            {footerInfo.engineer && (
              <p className="text-white-500 text-sm mt-1">
                Engineer: <span className="text-gray-500 font-semibold">{footerInfo.engineer}</span>
              </p>
            )}

            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">Find Us on Map</h4>
              <div className="rounded overflow-hidden border border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d276.7990756229687!2d77.80362725596723!3d28.738732210551085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c844598dd97bf%3A0xbfe5eab83db17e47!2z4KSX4KWL4KS54KS_4KSkIOCkquCljeCksOCli-CkquCksOCljeCkn-ClgOCknCDgpI_gpKPgpY3gpKEg4KS44KS_4KS14KS_4KSyIOCkh-CkguCknOCkv-CkqOCkv-Ckr-CksA!5e0!3m2!1sen!2sin!4v1752043105104!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="flex flex-col space-y-2 mt-4">
              <a href={phoneLink} className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400 dark:text-blue-300" />
                <span className="text-sm">+91 {contactInfo.phone || 'Not available'}</span>
              </a>
              <a href={emailLink} className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400 dark:text-blue-300" />
                <span className="text-sm">{contactInfo.email || 'Not available'}</span>
              </a>
            </div>

            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"><Facebook className="h-5 w-5 text-gray-300 hover:text-blue-500 transition" /></a>
              <a href="https://instagram.com/ved.gohit" target="_blank" rel="noopener noreferrer"><Instagram className="h-5 w-5 text-gray-300 hover:text-pink-500 transition" /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-gray-300 hover:text-blue-400 transition" /></a>
              <a href={`https://wa.me/91${contactInfo.phone}`} target="_blank" rel="noopener noreferrer"><MessageSquareText className="h-5 w-5 text-gray-300 hover:text-green-500 transition" /></a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer"><Youtube className="h-5 w-5 text-gray-300 hover:text-red-600 transition" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-white">Services</a></li>
              <li><a href="/properties" className="text-gray-300 hover:text-white">Properties</a></li>
              <li><a href="/projects" className="text-gray-300 hover:text-white">Projects</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Services + Subscribe */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 mb-6">
              <li><span className="text-gray-300">House Construction</span></li>
              <li><span className="text-gray-300">Plot Development</span></li>
              <li><span className="text-gray-300">Architectural Design</span></li>
              <li><span className="text-gray-300">Property Consultation</span></li>
              <li><span className="text-gray-300">Project Management</span></li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-2">Stay updated with the latest properties and offers!</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2 rounded text-black"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Subscribe
              </button>
            </form>

            {message && (
              <div
                className={`mt-3 text-sm rounded px-4 py-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Gohit Properties. All rights reserved.</p>
          <p className="text-gray-500 mt-3 text-sm">
            Made with ❤️ by <a href="https://www.chandrakantteotia.xyz" target="_blank" className="text-blue-400 hover:underline">Chandrakant Teotia</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 