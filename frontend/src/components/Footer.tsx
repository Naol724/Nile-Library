import React from 'react'
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">NileLibrary</h3>
            <p className="text-sm">
              A modern library management system where students and teachers can browse, borrow, and manage books efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Educational Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  History Section
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Science Books
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  Study Materials
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:library@modernlibrary.com" className="text-sm hover:text-white transition-colors">
                  library@modernlibrary.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+2519476775" className="text-sm hover:text-white transition-colors">
                  +251 947 6775
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow & Contact</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm">
              2026 NileLibrary — All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
