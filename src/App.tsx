import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import WhatsAppButton from './components/WhatsAppButton';
import Loader from './components/Loader';

// import AskGohitChat from './components/AskGohitChat';
import ContactBox from './components/ContactBox';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './pages/AdminPanel';
import Popup from './components/Popup'; // Moved Popup to separate file

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 transition-colors duration-300">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<><HomePage /><Popup /></>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            <Footer />
            {/* <WhatsAppButton /> */}
            {/* <AskGohitChat /> */}
            <ContactBox />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;