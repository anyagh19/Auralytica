import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Sales Forecasting Project | Built with 
          <span className="text-red-500 mx-1">❤️</span> 
          using React & Tailwind CSS
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Powered by Auralyst AI — Smart Inventory & Sales Management
        </p>
      </div>
    </footer>
  );
}

export default Footer;