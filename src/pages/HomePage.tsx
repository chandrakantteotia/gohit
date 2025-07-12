import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Award, TrendingUp } from 'lucide-react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import AutoTyping from '../components/AutoTyping';
import HeroSlider from '../components/HeroSlider';
import InfiniteSlider from '../components/InfiniteSlider';

interface FeaturedPlot {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  images: string[];
  status: string;
}

const HomePage: React.FC = () => {
  const [featuredPlots, setFeaturedPlots] = useState<FeaturedPlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPlots = async () => {
      try {
        const q = query(
          collection(db, 'plots'),
          where('status', '==', 'available'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const plots: FeaturedPlot[] = [];
        querySnapshot.forEach((doc) => {
          plots.push({ id: doc.id, ...doc.data() } as FeaturedPlot);
        });
        setFeaturedPlots(plots);
      } catch (error) {
        console.error('Error fetching featured plots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPlots();
  }, []);

  const stats = [
    { icon: Building2, label: 'Projects Completed', value: '150+' },
    { icon: Users, label: 'Happy Clients', value: '500+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: TrendingUp, label: 'Success Rate', value: '98%' },
  ];

  const typingTexts = [
    'Dream Home',
    'Perfect Plot',
    'Modern House',
    'Premium Location',
    'Quality Construction'
  ];

  const heroImages = [
    {
      url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Premium Construction Services',
      subtitle: 'Building your dreams with modern techniques and quality materials'
    },
    {
      url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Premium Plot Development',
      subtitle: 'Prime locations with world-class amenities and infrastructure'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroSlider images={heroImages} autoSlide slideInterval={4000} />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Building Your{' '}
              <span className="text-yellow-400">
                <AutoTyping texts={typingTexts} speed={120} deleteSpeed={80} pauseTime={1500} />
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Professional civil engineering services for construction, design, and premium plots.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/properties" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-lg">
                View Properties <ArrowRight className="inline ml-2" size={18} />
              </Link>
              <Link to="/contact" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition shadow-lg">
                Get Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our Achievements</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Numbers that speak for our excellence and commitment to quality</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="slider-container relative">
            <InfiniteSlider stats={stats} speed={25} className="py-8" />
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              <span className="font-semibold text-blue-600">15+ Years</span> of Excellence in Construction & Real Estate
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Discover our premium plots and houses</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPlots.map((plot) => (
                <div key={plot.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <img src={plot.images[0] || 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=400'} alt={plot.title} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{plot.title}</h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                      {plot.location}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">₹{plot.price}</span>
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">{plot.area}</span>
                    </div>
                    <Link to={`/properties/${plot.id}`} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center block font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/properties" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span>View All Properties</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Complete construction and real estate solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Building2 className="h-8 w-8 text-blue-600" />, title: 'House Construction', desc: 'Complete home construction services from foundation to finishing with modern techniques' },
              { icon: <Users className="h-8 w-8 text-green-600" />, title: 'Plot Development', desc: 'Premium plot development with all necessary approvals and modern amenities' },
              { icon: <Award className="h-8 w-8 text-orange-600" />, title: 'Expert Consultation', desc: 'Professional consultation for all your construction and real estate requirements' }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span>View All Services</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
