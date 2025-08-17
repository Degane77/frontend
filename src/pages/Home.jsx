import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaBrain,
  FaUsers,
  FaShieldAlt,
  FaLightbulb,
  FaHandHoldingHeart,
  FaLeaf,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaPlay,
  FaComments,
  FaStethoscope,
  FaBook,
  FaUserMd,
  FaChartLine,
  FaAward,
  FaClock
} from 'react-icons/fa';
import { FaHospital } from 'react-icons/fa';
import hospital from '../assets/hospital.jpg';
import { useState } from 'react';
const Home = () => {
  return (
    <div className="min-h-screen bg-amber-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <FaHeart className="text-6xl mx-auto mb-4 text-pink-300" />
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to CAFYE Health
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
                Your trusted partner for comprehensive mental health support and wellness resources. 
                We're here to help you live a happier, healthier life.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/ask-doctor"
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <FaComments />
                  Start AI Chat
                </div>
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <FaUsers />
                  Join Community
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-green-300 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-blue-100">Happy Users</div>
              </div>
              <div className="bg-blue-700 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-blue-100">Expert Doctors</div>
              </div>
              <div className="bg-blue-300 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Support Available</div>
              </div>
              <div className="bg-blue-300 bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-blue-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive mental health support services designed to meet your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Mental Health Assistant */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <FaBrain className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Mental Health Assistant</h3>
              <p className="text-gray-600 mb-6">
                Our advanced AI assistant provides immediate support, guidance, and resources 
                for mental health concerns, available 24/7.
              </p>
              <Link
                to="/ask-doctor"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
              >
                Try AI Assistant <FaArrowRight />
              </Link>
            </div>

            {/* Professional Doctor Network */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <FaUserMd className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Doctor Network</h3>
              <p className="text-gray-600 mb-6">
                Connect with verified mental health professionals and specialists 
                who are committed to providing quality care.
              </p>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Find Doctors <FaArrowRight />
              </Link>
            </div>

            {/* Educational Resources */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <FaBook className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Educational Resources</h3>
              <p className="text-gray-600 mb-6">
                Access comprehensive guides on mental health, 
                wellness, and self-care practices.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
              >
                Learn More <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About CAFYE Health</h2>
              <p className="text-lg text-gray-600 mb-6">
                Dedicated to providing comprehensive mental health support and wellness resources 
                to help you live a happier, healthier life.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We combine cutting-edge AI technology with human expertise to create a comprehensive 
                mental health support system that's available 24/7, confidential, and judgment-free.
              </p>
              <div className="flex items-center gap-4 mb-8">
                <FaHandHoldingHeart className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Compassionate Care</h3>
                  <p className="text-gray-600">Every interaction is guided by empathy and understanding</p>
                </div>
              </div>
              <Link
                to="/about"
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                Learn More <FaArrowRight />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 text-white">
                <FaBrain className="text-6xl mb-4" />
                <h3 className="text-2xl font-bold mb-4">Mental Health Matters</h3>
                <p className="text-lg">
                  Your mental well-being is our priority. We're here to support you on your journey 
                  to better mental health, one step at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CAFYE Health?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to providing the best mental health support experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600">We approach every interaction with empathy and understanding.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy</h3>
              <p className="text-gray-600">Your privacy and confidentiality are our top priorities.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600">We support your journey toward mental wellness and personal growth.</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in all aspects of mental health care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Take the first step toward better mental health today. Our AI assistant is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/ask-doctor"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Chatting with AI
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
