import React, { useState, useEffect, lazy, Suspense } from 'react';
import ChatWindow from '../Components/ChatWindow';
import { getMessages, sendMessage } from '../services/messageService';
import { Link } from 'react-router-dom';
import { getUserBookings, cancelBooking, updatePaymentStatus } from '../services/bookingService';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCamera,
  FaComments,
  FaHeart,
  FaBook,
  FaStethoscope,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaCalendar
} from 'react-icons/fa';

const UserMessages = lazy(() => import('./UserMessages'));

const UserDashboard = () => {
  // State hooks
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentEdit, setPaymentEdit] = useState({ paymentAmount: 10, paymentNumber: '', paymentMethod: 'jeeb' });
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [showMessages, setShowMessages] = useState(false);
  const [showChatWithDoctor, setShowChatWithDoctor] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorMessages, setDoctorMessages] = useState([]);
  const [doctorMsgLoading, setDoctorMsgLoading] = useState(false);
  const [messageManagerOpen, setMessageManagerOpen] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  // Fetch all messages for message manager
  const fetchAllMessages = async () => {
    if (!user || !user._id) {
      setAllMessages([]);
      return;
    }
    setDoctorMsgLoading(true);
    try {
      const res = await getMessages(user._id);
      setAllMessages(res.data);
    } catch {
      setAllMessages([]);
    } finally {
      setDoctorMsgLoading(false);
    }
  };

  // Open chat with doctor
  const handleContactDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatWithDoctor(true);
    setDoctorMsgLoading(true);
    try {
      const res = await getMessages(doctor._id);
      setDoctorMessages(res.data);
    } catch {
      setDoctorMessages([]);
    } finally {
      setDoctorMsgLoading(false);
    }
  };

  // Send message to doctor
  const handleSendToDoctor = async (content, file) => {
    if (!selectedDoctor) return;
    const formData = new FormData();
    formData.append('receiver', selectedDoctor._id);
    formData.append('content', content);
    if (file) formData.append('attachments', file);
    await sendMessage(formData);
    // Refresh messages
    const res = await getMessages(selectedDoctor._id);
    setDoctorMessages(res.data);
  };
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // Fetch profile & bookings on mount
  useEffect(() => {
    fetchUserProfile();
    fetchBookings();
  }, []);

  // Fetch bookings
  const fetchBookings = async () => {
    setBookingLoading(true);
    try {
      const res = await getUserBookings();
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setBookingLoading(false);
    }
  };

  // Fetch profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profiles/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || ''
        });
      } else {
        const userInfo = localStorage.getItem('user');
        if (userInfo) {
          const userData = JSON.parse(userInfo);
          setUser(userData);
          setFormData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: '',
            address: ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open payment manager for booking
  const openPaymentManager = (booking) => {
    setEditingPayment(booking._id);
    setPaymentEdit({
      paymentAmount: booking.paymentAmount || 10,
      paymentNumber: booking.paymentNumber || '',
      paymentMethod: booking.paymentMethod || 'jeeb',
    });
    setPaymentError('');
  };

  // Save payment changes
  const savePaymentManager = async (bookingId) => {
    setSavingPayment(true);
    setPaymentError('');
    try {
      await updatePaymentStatus(bookingId, {
        paymentAmount: paymentEdit.paymentAmount,
        paymentNumber: paymentEdit.paymentNumber,
        paymentMethod: paymentEdit.paymentMethod,
      });
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, ...paymentEdit } : b));
      setEditingPayment(null);
    } catch {
      setPaymentError('Failed to update payment info');
    } finally {
      setSavingPayment(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelingId(id);
    try {
      await cancelBooking(id);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
    } catch {
      alert('Failed to cancel booking');
    } finally {
      setCancelingId(null);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show messages
  if (showMessages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button className="mb-4 bg-gray-200 px-4 py-2 rounded" onClick={() => setShowMessages(false)}>
            Back to Dashboard
          </button>
          <Suspense fallback={<div>Loading...</div>}>
            <UserMessages userId={user?._id} />
          </Suspense>
        </div>
      </div>
    );
  }

  // Show chat with doctor
  if (showChatWithDoctor && selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button className="mb-4 bg-gray-200 px-4 py-2 rounded" onClick={() => setShowChatWithDoctor(false)}>
            Back to Bookings
          </button>
          <h2 className="text-xl font-bold mb-2">Chat with Dr. {selectedDoctor.fullName || selectedDoctor.name}</h2>
          <ChatWindow
            messages={doctorMessages}
            onSend={handleSendToDoctor}
            currentUserId={user?._id}
            loading={doctorMsgLoading}
          />
        </div>
      </div>
    );
  }

  // Show message manager
  if (messageManagerOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button className="mb-4 bg-gray-200 px-4 py-2 rounded" onClick={() => setMessageManagerOpen(false)}>
            Back to Dashboard
          </button>
          <h2 className="text-xl font-bold mb-4">Message Manager</h2>
          <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={fetchAllMessages}>Refresh</button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">To/From</th>
                  <th className="px-4 py-2 border">Content</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {allMessages.map(msg => (
                  <tr key={msg._id}>
                    <td className="border px-2 py-1">{msg.sender?._id === user._id ? `To: ${msg.receiver?.fullName || msg.receiver?.name}` : `From: ${msg.sender?.fullName || msg.sender?.name}`}</td>
                    <td className="border px-2 py-1">{msg.content}</td>
                    <td className="border px-2 py-1">{new Date(msg.createdAt).toLocaleString()}</td>
                    <td className="border px-2 py-1">{msg.read ? 'Read' : 'Unread'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctorMsgLoading && <div className="text-center text-gray-400">Loading...</div>}
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={() => setShowMessages(true)}
              >
                Messages
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaBell className="text-xl" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaCog className="text-xl" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Bookings</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => { setMessageManagerOpen(true); fetchAllMessages(); }}>Message Manager</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Doctor</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Payment</th>
                <th className="px-4 py-2 border">Contact</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td className="border px-2 py-1">{booking.doctor?.fullName || booking.doctor?.name}</td>
                  <td className="border px-2 py-1">{new Date(booking.date).toLocaleString()}</td>
                  <td className="border px-2 py-1">{booking.status}</td>
                  <td className="border px-2 py-1">{booking.paymentStatus || 'Pending'}</td>
                  <td className="border px-2 py-1">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleContactDoctor(booking.doctor)}>Contact</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookingLoading && <div className="text-center text-gray-400">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
