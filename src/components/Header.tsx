
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Phone, Mail, User, LogOut } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              HandyPro
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <motion.a
                    href="/dashboard"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <User size={16} />
                    <span>Dashboard</span>
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span>info@handypro.com</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4"
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ x: 10 }}
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              
              {user ? (
                <div className="pt-4 border-t">
                  <motion.a
                    href="/dashboard"
                    whileHover={{ x: 10 }}
                    className="block py-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </motion.a>
                  <motion.button
                    whileHover={{ x: 10 }}
                    onClick={handleSignOut}
                    className="block py-2 text-red-600 hover:text-red-800 text-left"
                  >
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ x: 10 }}
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-blue-600 hover:text-blue-800 text-left mt-4 pt-4 border-t"
                >
                  Sign In / Sign Up
                </motion.button>
              )}
            </motion.nav>
          )}
        </div>
      </motion.header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
