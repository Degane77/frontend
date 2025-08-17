import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaUserMd,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSignOutAlt,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../services/bookingService';
import logo from '../assets/cafye-logo.png';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus, doctorNotes) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus, doctorNotes });
      setShowStatusModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'confirmed':
        return <FaCheckCircle className="text-green-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      case 'completed':
        return <FaCheckCircle className="text-blue-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020024] to-[#043860] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020024] to-[#043860] text-white">
      {/* Header */}
      <div className="bg-[#010a2b] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admindashboard" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition">
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Cafiye Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-green-400">Booking Manager</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#010a2b] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <FaCalendarAlt className="text-3xl text-green-400" />
            </div>
          </div>
          <div className="bg-[#010a2b] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <FaClock className="text-3xl text-yellow-400" />
            </div>
          </div>
          <div className="bg-[#010a2b] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-green-400">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-green-400" />
            </div>
          </div>
          <div className="bg-[#010a2b] p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-400">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <FaCheckCircle className="text-3xl text-blue-400" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-green-400" />
            All Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Bookings Yet</h3>
              <p className="text-gray-400">No appointments have been booked yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Patient</th>
                    <th className="text-left py-3 px-4">Doctor</th>
                    <th className="text-left py-3 px-4">Date & Time</th>
                    <th className="text-left py-3 px-4">Reason</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-gray-700 hover:bg-[#020024]">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">{booking.patient?.fullName}</p>
                          <p className="text-sm text-gray-400">{booking.patient?.email}</p>
                          <p className="text-sm text-gray-400">{booking.contactPhone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">{booking.doctor?.fullName}</p>
                          <p className="text-sm text-gray-400">{booking.doctor?.specialty}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">{formatDate(booking.appointmentDate)}</p>
                          <p className="text-sm text-gray-400">{booking.appointmentTime}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm">{booking.reason}</p>
                          {booking.isEmergency && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400 mt-1">
                              <FaExclamationTriangle />
                              Emergency
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowStatusModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Booking Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Notes (Optional)
                </label>
                <textarea
                  id="doctorNotes"
                  rows="3"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes for the patient..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  const status = document.getElementById('status').value;
                  const doctorNotes = document.getElementById('doctorNotes').value;
                  handleStatusUpdate(selectedBooking._id, status, doctorNotes);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Update Status
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager; 