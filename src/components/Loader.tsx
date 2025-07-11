import React from 'react';
import Logo from '../assets/footerLogo.png'; // Change to your logo path

const Loader: React.FC = () => {
  return (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">

      <img
        src={Logo}
        alt="Gohit Properties"
        className="w-132 h-32 animate-pulse"
      />
    </div>
  );
};

export default Loader;
