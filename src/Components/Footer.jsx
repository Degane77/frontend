// components/Footer.jsx
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaBrain,
  FaShieldAlt,
  FaUsers,
  FaLeaf,
  FaArrowUp
} from 'react-icons/fa';
// import logo from '../assets/cafye-logo.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
         <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
       {/* Main Footer Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CAAFIYE Health</h3>
                <p className="text-sm text-gray-300">Mental Health Support</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Dedicated to providing comprehensive mental health support and wellness resources 
              to help you live a happier, healthier life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaUsers className="text-green-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-300 hover:text-white transition-colors">
                  Find Doctors
                </Link>
              </li>

              <li>
                <Link to="/ask-doctor" className="text-gray-300 hover:text-white transition-colors">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaBrain className="text-blue-400" />
              Our Services
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-300">
                AI Mental Health Assistant
              </li>
              <li className="text-gray-300">
                Professional Doctor Network
              </li>
              <li className="text-gray-300">
                Educational Resources
              </li>
              <li className="text-gray-300">
                24/7 Support
              </li>
              <li className="text-gray-300">
                Confidential Counseling
              </li>
              <li className="text-gray-300">
                Wellness Programs
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-purple-400" />
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-400" />
                <div>
                  <p className="text-gray-300">+252 061 2 10 35 85</p>
                   <p className="text-gray-300">+252 061 6 13 53 79</p>
                  <p className="text-sm text-gray-400">24/7 Support</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-400" />
                <div>
                  <p className="text-gray-300">support@cafiyehealth.com</p>
                  <p className="text-sm text-gray-400">Email Support</p>
                  <p className="text-sm text-gray-400">Dev Garaad Personal Email: abdiqani2259@gmail.com</p>

                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-400" />
                <div>
                  <p className="text-gray-300">Online Support</p>
                  <p className="text-sm text-gray-400">Mogadishu, Somalia</p>
                  <p className="text-sm text-gray-400">Admin Email: abdiqani2259@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

                 {/* Mental Health Support Section */}
         <div className="mt-8 pt-6 border-t border-gray-200">
  <div className="bg-gradient-to-r from-green-800 to-teal-500 rounded-3xl p-8 text-center shadow-lg">
    
    {/* Title */}
    <div className="flex items-center justify-center gap-3 mb-4">
      <FaHeart className="text-2xl text-pink-300 drop-shadow" />
      <h3 className="text-2xl font-bold text-white">Mental Health Support</h3>
      <FaHeart className="text-2xl text-pink-300 drop-shadow" />
    </div>

    {/* Description */}
    <p className="text-lg text-green-50 mb-8 max-w-3xl mx-auto leading-relaxed">
      If you're experiencing a mental health crisis or having thoughts of self-harm, 
      please reach out for immediate help. <span className="font-semibold">You are not alone</span>, 
      and support is available <span className="underline">24/7</span>.
    </p>

    {/* Info Boxes */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Crisis Hotline */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-md border border-white/30 hover:bg-white/30 transition">
        <h4 className="font-semibold text-white mb-2">📞 Crisis Hotline</h4>
        <p className="text-lg font-bold text-blue-700">1-800-273-8255</p>
      </div>

      {/* Emergency Services */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-md border border-white/30 hover:bg-white/30 transition">
        <h4 className="font-semibold text-white mb-2">🚨 Emergency Services</h4>
        <p className="text-lg font-bold text-blue-700">911 (US) / 999 (UK)</p>
      </div>

      {/* Text Support */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 shadow-md border border-white/30 hover:bg-white/30 transition">
        <h4 className="font-semibold text-white mb-2">💬 Text Support</h4>
        <p className="text-lg font-bold text-blue-700">Text HOME to 741741</p>
      </div>
    </div>
  </div>
</div>


                 {/* Values Section */}
         <div className="mt-8 pt-6 border-t border-gray-700">
           <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">Our Commitment to You</h3>
            <p className="text-gray-300 max-w-3xl mx-auto">
              We are committed to providing compassionate, confidential, and accessible mental health support 
              to everyone who needs it. Your well-being is our priority.
            </p>
          </div>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="text-center">
               <div className="bg-green-500 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <FaHeart className="text-xl text-green-400" />
              </div>
              <h4 className="font-semibold mb-1 text-sm">Compassion</h4>
              <p className="text-xs text-gray-400">Empathetic care for all</p>
            </div>
                         <div className="text-center">
               <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                 <FaShieldAlt className="text-xl text-blue-400" />
               </div>
               <h4 className="font-semibold mb-1 text-sm">Privacy</h4>
               <p className="text-xs text-gray-400">Your confidentiality matters</p>
             </div>
             <div className="text-center">
               <div className="bg-purple-500 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                 <FaLeaf className="text-xl text-purple-400" />
               </div>
               <h4 className="font-semibold mb-1 text-sm">Growth</h4>
               <p className="text-xs text-gray-400">Supporting your journey</p>
             </div>
             <div className="text-center">
               <div className="bg-orange-500 bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                 <FaBrain className="text-xl text-orange-400" />
               </div>
               <h4 className="font-semibold mb-1 text-sm">Innovation</h4>
               <p className="text-xs text-gray-400">Cutting-edge AI support</p>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black bg-opacity-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} CAAFIYE Health. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Developed with ❤️ by Garaad Bashiir Hussein
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <button
                onClick={scrollToTop}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                title="Scroll to top"
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
