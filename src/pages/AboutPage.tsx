import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Award, Users, Building2, Target } from 'lucide-react';
import { db } from '../firebase/config';

interface AboutContent {
  story: string;
  imageUrl: string;
}

const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);

  const achievements = [
    { icon: Building2, title: 'Projects Completed', value: '150+' },
    { icon: Users, title: 'Happy Clients', value: '500+' },
    { icon: Award, title: 'Years Experience', value: '15+' },
    { icon: Target, title: 'Success Rate', value: '98%' },
  ];

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const q = query(collection(db, 'about'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setAboutData({
            story: data.story,
            imageUrl: data.imageUrl,
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };

    fetchAboutContent();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gohit Properties</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building excellence through innovation, expertise, and unwavering commitment to quality construction.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 whitespace-pre-line">
                {aboutData?.story || 'Loading story...'}
              </p>
            </div>
            <div className="lg:pl-8">
              {aboutData?.imageUrl ? (
                <img
                  src={aboutData.imageUrl}
                  alt="Our Story"
                  className="rounded-lg shadow-lg w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
          <p className="text-xl text-gray-600 mb-12">Numbers that speak for our commitment to excellence</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.value}</div>
                <div className="text-gray-600">{achievement.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To provide exceptional construction services and premium real estate solutions that 
              create lasting value for our clients. We are committed to delivering projects that 
              combine innovative design, superior quality, and sustainable practices.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To be the leading construction and real estate development company, recognized for 
              our commitment to excellence, innovation, and customer satisfaction. We aim to 
              shape the future of construction through sustainable and cutting-edge solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Expertise</h2>
          <p className="text-xl text-gray-600 mb-12">Professional qualifications and certifications</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Civil Engineering</h3>
              <p className="text-gray-600">Licensed civil engineer with expertise in structural design and construction management</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">Certified in quality management systems and construction safety protocols</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Management</h3>
              <p className="text-gray-600">PMP certified with extensive experience in large-scale construction projects</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
