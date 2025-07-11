import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MapPin, ArrowLeft, Phone, Mail, MessageCircle, Image as ImageIcon } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Property {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  images: string[];
  status: string;
  description: string;
  type: string;
  amenities?: string[];
  createdAt?: any;
  naksha?: string;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState<{ phone: string; email: string }>({
    phone: '',
    email: ''
  });
  const [showNaksha, setShowNaksha] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactInfo'));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setContactInfo({
            phone: data.phone || '',
            email: data.email || ''
          });
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    fetchContactInfo();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'plots', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleWhatsAppClick = () => {
    let phoneNumber = contactInfo.phone.trim().replace(/\s|-/g, '');
    if (!phoneNumber.startsWith('+')) phoneNumber = '+91' + phoneNumber;
    const message = `Hello! I'm interested in the property: ${property?.title}. Please provide more details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-800">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/properties" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Slider {...sliderSettings}>
                {property.images.map((img, i) => (
                  <div key={i}>
                    <img
                      src={img || 'https://via.placeholder.com/800x600?text=No+Image'}
                      alt={`slide-${i}`}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹{property.price}</div>
                  <div className="text-sm text-gray-600">Price</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{property.area}</div>
                  <div className="text-sm text-gray-600">Area</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${property.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>{property.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{property.type}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
              {property.amenities && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {property.amenities.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
              {property.naksha && (
                <button
                  onClick={() => setShowNaksha(true)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
                >
                  <ImageIcon className="h-5 w-5 mr-2" /> View Plot Layout
                </button>
              )}
              {showNaksha && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
                    <h2 className="text-xl font-bold mb-4">Plot Layout</h2>
                    <img src={property.naksha} alt="Plot Layout" className="w-full h-auto rounded" />
                    <button
                      onClick={() => setShowNaksha(false)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              {contactInfo.phone && (
                <div className="flex items-center text-gray-600 mb-3">
                  <Phone className="h-5 w-5 mr-3" />
                  {contactInfo.phone}
                </div>
              )}
              {contactInfo.email && (
                <div className="flex items-center text-gray-600 mb-6">
                  <Mail className="h-5 w-5 mr-3" />
                  {contactInfo.email}
                </div>
              )}
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition mb-3 flex items-center justify-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp Inquiry
              </button>
              <a
                href={`tel:${contactInfo.phone}`}
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 mb-3"
              >
                Call Now
              </a>
              <Link
                to="/contact"
                className="block w-full text-center bg-gray-700 text-white py-3 rounded-md hover:bg-gray-800"
              >
                Send Email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
