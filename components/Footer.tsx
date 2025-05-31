import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-50 w-full border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-[#4ED7F1] mb-4 md:mb-0">&copy; 2025 Finstant. All rights reserved.</p>
        <nav className="flex gap-6 text-sm">
          <Link href="#" className="text-[#4ED7F1] hover:underline transition-colors duration-200">
            Terms
          </Link>
          <Link href="#" className="text-[#4ED7F1] hover:underline transition-colors duration-200">
            Privacy
          </Link>
          <Link href="#" className="text-[#4ED7F1] hover:underline transition-colors duration-200">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
