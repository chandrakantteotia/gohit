import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [contactInfo, setContactInfo] = useState<{
    phone: string;
    email: string;
    address: string;
    businessHours: { day: string; open: string; close: string }[];
  }>({
    phone: '',
    email: '',
    address: '',
    businessHours: []
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactInfo'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setContactInfo({
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            businessHours: Array.isArray(data.businessHours) ? data.businessHours : []
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: new Date()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppClick = () => {
  let phoneNumber = contactInfo.phone || '+918394847762'; // Default phone number if not available

  // ✅ Ensure it starts with country code (e.g., +91)
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+91' + phoneNumber.replace(/^0+/, ''); // remove leading 0s and add +91
  }

  const message = 'Hello! I would like to know more about your construction services.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with us for all your construction and real estate needs
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600"><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
</p>
                      </div>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600"><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                      </div>
                    </div>
                  )}
                  {contactInfo.address && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                  {contactInfo.businessHours.length > 0 && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Business Hours</p>
                        {contactInfo.businessHours.map((item, idx) => (
                          <p key={idx} className="text-gray-600">
                            {item.day}: {item.open} - {item.close}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="bg-green-50 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-800">Quick Connect</h3>
                <p className="text-green-700 mb-4">
                  Need immediate assistance? Connect with us on WhatsApp for instant support.
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
  <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Location</h4>
  <div className="rounded overflow-hidden border border-gray-300 shadow-md w-98">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d276.7990756229687!2d77.80362725596723!3d28.738732210551085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c844598dd97bf%3A0xbfe5eab83db17e47!2z4KSX4KWL4KS54KS_4KSkIOCkquCljeCksOCli-CkquCksOCljeCkn-ClgOCknCDgpI_gpKPgpY3gpKEg4KS44KS_4KS14KS_4KSyIOCkh-CkguCknOCkv-CkqOCkv-Ckr-CksA!5e0!3m2!1sen!2sin!4v1752043105104!5m2!1sen!2sin"
      width="100%"
      height="350"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>
      </section>
    </div>
  );
};

export default ContactPage;
