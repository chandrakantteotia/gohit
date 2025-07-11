import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  Building2, Home, Wrench, Users, MapPin, Calculator, X
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const defaultServices = [
    {
      id: '1',
      title: 'House Construction',
      description: 'Complete residential construction services from foundation to finishing with modern designs and quality materials.',
      icon: Home
    },
    {
      id: '2',
      title: 'Plot Development',
      description: 'Premium plot development with proper planning, legal approvals, and infrastructure development.',
      icon: MapPin
    },
    {
      id: '3',
      title: 'Architectural Design',
      description: 'Professional architectural design services for residential and commercial projects with 3D visualization.',
      icon: Building2
    },
    {
      id: '4',
      title: 'Interior Design',
      description: 'Modern interior design solutions that blend functionality with aesthetics for all types of spaces.',
      icon: Wrench
    },
    {
      id: '5',
      title: 'Project Management',
      description: 'End-to-end project management services ensuring timely delivery and quality construction.',
      icon: Users
    },
    {
      id: '6',
      title: 'Cost Estimation',
      description: 'Accurate cost estimation and budgeting services for construction projects of all sizes.',
      icon: Calculator
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData: Service[] = [];
        querySnapshot.forEach((doc) => {
          servicesData.push({ id: doc.id, ...doc.data() } as Service);
        });
        setServices(servicesData.length > 0 ? servicesData : defaultServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (index: number) => {
    const icons = [Home, MapPin, Building2, Wrench, Users, Calculator];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">Comprehensive construction and real estate solutions tailored to your needs</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = getIcon(index);
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description.slice(0, 80)}...</p>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Learn More Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setSelectedService(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{selectedService.title}</h3>
            <p className="text-gray-600">{selectedService.description}</p>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedService(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">How we deliver exceptional results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Consultation', 'Planning', 'Execution', 'Delivery'].map((title, index) => (
              <div key={index} className="text-center">
                <div className={`text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${['bg-blue-600', 'bg-green-600', 'bg-orange-600', 'bg-purple-600'][index]}`}>
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  {[
                    'Initial consultation to understand your requirements and vision',
                    'Detailed planning and design with cost estimation',
                    'Professional execution with quality control and monitoring',
                    'Timely delivery with post-completion support'
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Get in touch with us for a free consultation and quote</p>
          <a
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
