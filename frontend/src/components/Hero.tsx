import React from 'react'
import { Link } from 'react-router-dom'
import heroBg1 from '@/assets/images/heroes/background5.avif'
import heroBg2 from '@/assets/images/heroes/background6.avif'
import heroBg3 from '@/assets/images/heroes/background7.avif'
import { BookOpen, ArrowRight } from 'lucide-react'

const Hero = () => {
  // Array of hero images for rotation
  const heroImages = [heroBg1, heroBg2, heroBg3]
  const [currentBg, setCurrentBg] = React.useState(0)

  // Rotate background every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background with rotation */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${heroImages[currentBg]})` }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Welcome to Online Library
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-delayed">
            Your Online Platform for Educational Books — Anytime, Anywhere.
          </p>
          
          <Link
            to="/books"
            className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Explore Books
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-delayed {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-out 0.3s;
        }
      `}</style>
    </section>
  )
}

export default Hero
