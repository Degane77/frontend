import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import About from './pages/About';
import UserManager from './Components/UserManager';
import AdminDashboard from './pages/AdminDashboard';
import DoctorManager from './Components/DoctorManager';
import DoctorForm from './Components/DoctorForm';
import ProfileForm from './Components/ProfileForm';
import AllContacts from './Components/AllContacts';
import DoctorList from './Components/DoctorList';
import ContactManager from './Components/ContactManager';
import ArticleCusubManager from './Components/ArticleCusubManager';
import BookingManager from './Components/BookingManager';
import DoctorBooking from './Components/DoctorBooking';

import Chatbot from './pages/Chatbot';
import ChatAdmin from './pages/ChatAdmin';
import UserDashboard from './pages/UserDashboard';
import ContactForm from './pages/ContactForm';
import Profile from './Components/Profile';
import ArticleForm from './Components/ArticleForm';
import ArticleList from './Components/ArticleList';
import ArticleManager from './Components/ArticleManager';
import Articles from './pages/Articles';
import './App.css';

// Layout component that includes Navbar and Footer
const Layout = ({ children }) => {
  return (
    <div className="App">
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

// Protect admin dashboard route
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
}

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/articles" element={<Layout><Articles /></Layout>} />
        <Route path="/doctors" element={<Layout><DoctorList /></Layout>} />
        <Route path="/contact" element={<Layout><ContactForm /></Layout>} />
        <Route path="/chatbot" element={<Layout><Chatbot /></Layout>} />

        
        {/* Admin routes without layout (they have their own navigation) */}
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/usermanager" element={<UserManager />} />
        <Route path="/articleform" element={<ArticleForm />} />
        <Route path="/articlelist" element={<ArticleList />} />
        <Route path="/articlemanager" element={<ArticleManager />} />
        <Route path="/bookingmanager" element={<BookingManager />} />
        <Route path="/profileform" element={<ProfileForm />} />
        <Route path="/doctormanager" element={<DoctorManager />} />
        <Route path="/doctorform" element={<DoctorForm />} />
        <Route path="/doctorform/:id" element={<DoctorForm />} />
        <Route path="/contactmanager" element={<ContactManager />} />
        <Route path="/chatadmin" element={<ChatAdmin />} />
        <Route path="/AllContacts" element={<AllContacts />} />
        
        {/* User routes */}
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/userdashboard" element={<Layout><UserDashboard /></Layout>} />
        <Route path="/ask-doctor" element={<Layout><Chatbot /></Layout>} />
        <Route path="/doctor/:doctorId/book" element={<Layout><DoctorBooking /></Layout>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
