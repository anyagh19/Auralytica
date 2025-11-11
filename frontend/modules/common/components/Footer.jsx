import React from 'react'

function Footer() {
  return (
    <div>
      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center">
        <p>© {new Date().getFullYear()} Sales Forecasting Project | Built with ❤️ using React & Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default Footer