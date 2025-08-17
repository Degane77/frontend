import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaCalendar,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa';
import { getAvailableSlots, createBooking } from '../services/bookingService';

const DoctorBooking = () => {
  // Payment status UI state
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'pending' | 'processing' | 'success' | 'failed'
  const [paymentRef, setPaymentRef] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    reason: '',
    symptoms: '',
    notes: '',
    isEmergency: false,
    contactPhone: '',
    contactEmail: '',
    paymentMethod: 'jeeb',
    paymentNumber: '0612103585',
    paymentAmount: 10
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
        }
      } catch (error) {
        console.error('Error fetching doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchAvailableSlots();
    }
  }, [selectedDate, doctorId]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await getAvailableSlots(doctorId, selectedDate);
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Simulate receipt download (for demo)
  const handleDownloadReceipt = () => {
    const receiptContent = `Payment Receipt\nReference: ${paymentRef}\nAmount: $${formData.paymentAmount}\nMethod: ${formData.paymentMethod}\nNumber: ${formData.paymentNumber}`;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentRef || 'booking'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pre-submit validation for required fields
    if (!doctorId) {
      alert('Doctor ID is missing. Please try again.');
      return;
    }
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time.');
      return;
    }
    if (!formData.reason || formData.reason.trim().length < 5) {
      alert('Please provide a valid reason for your visit (at least 5 characters).');
      return;
    }
    if (!formData.contactPhone || formData.contactPhone.trim().length < 7) {
      alert('Please provide a valid phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setPaymentStatus('pending');
    try {
      const bookingData = {
        doctorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: formData.reason.trim(),
        symptoms: formData.symptoms?.trim() || undefined,
        notes: formData.notes?.trim() || undefined,
        isEmergency: formData.isEmergency,
        contactPhone: formData.contactPhone.trim(),
        contactEmail: formData.contactEmail?.trim() || undefined,
        paymentMethod: formData.paymentMethod,
        paymentNumber: formData.paymentNumber,
        paymentAmount: formData.paymentAmount
      };
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Simulate payment processing delay
      setPaymentStatus('processing');
      const response = await createBooking(bookingData, config);
      if (response.data && (response.data.message === 'Booking created successfully' || response.status === 201)) {
        setPaymentStatus('success');
        setPaymentRef(response.data.booking?.paymentRef || response.data.booking?._id || '');
        setShowReceipt(true);
        setTimeout(() => {
          navigate('/userdashboard');
        }, 3500);
      } else {
        setPaymentStatus('failed');
        setErrorMsg(response.data?.message || 'Error creating booking');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setShowReceipt(false);
      if (error.response) {
        setErrorMsg(error.response.data?.message || 'Backend error');
      } else {
        setErrorMsg('Error creating booking');
      }
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-4">The doctor you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      {/* Payment Status Banners/Modals */}
      {paymentStatus === 'pending' && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-yellow-200 text-yellow-900 px-6 py-3 rounded-b-lg shadow-lg flex items-center gap-2 animate-pulse mt-2">
            <span className="font-semibold">Payment Pending:</span> Please wait while we process your payment...
          </div>
        </div>
      )}
      {paymentStatus === 'processing' && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-blue-200 text-blue-900 px-6 py-3 rounded-b-lg shadow-lg flex items-center gap-2 animate-pulse mt-2">
            <span className="font-semibold">Processing Payment:</span> Your payment is being processed. Do not close this window.
          </div>
        </div>
      )}
      {paymentStatus === 'success' && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-green-200 text-green-900 px-6 py-3 rounded-b-lg shadow-lg flex items-center gap-2 mt-2">
            <span className="font-semibold">Payment Successful!</span> Your booking is confirmed.
            {paymentRef && (
              <span className="ml-4">Ref: <span className="font-mono bg-white px-2 py-1 rounded text-green-700">{paymentRef}</span></span>
            )}
            {showReceipt && (
              <button onClick={handleDownloadReceipt} className="ml-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm">Download Receipt</button>
            )}
          </div>
        </div>
      )}
      {paymentStatus === 'failed' && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-red-200 text-red-900 px-6 py-3 rounded-b-lg shadow-lg flex items-center gap-2 mt-2">
            <span className="font-semibold">Payment Failed:</span> {errorMsg || 'There was a problem processing your payment.'}
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/doctors')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
          >
            <FaArrowLeft /> Back to Doctors
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctor Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                {doctor.doctorImage?.filename ? (
                  <img
                    src={` https://backend-voz7.onrender.com/uploads/doctors/${doctor.doctorImage.filename}`}
                    alt={doctor.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserMd className="text-3xl text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{doctor.fullName}</h2>
                <p className="text-green-600 font-semibold">{doctor.specialty}</p>
                {doctor.isVerified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <FaCheckCircle />
                    <span>Verified Doctor</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {doctor.educationLevel && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUserMd className="text-green-500" />
                  <span>{doctor.educationLevel}</span>
                </div>
              )}
              {doctor.workplace && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>{doctor.workplace}</span>
                </div>
              )}
              {doctor.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-green-500" />
                  <span>{doctor.phone}</span>
                </div>
              )}
              {doctor.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-green-500" />
                  <span>{doctor.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaCalendar className="text-green-600 text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Your Appointment</h3>
                <p className="text-sm text-gray-600">Fill in the details below to book your consultation</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date and Time Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  Appointment Schedule
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📅 Preferred Date *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      required
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Select your preferred appointment date</p>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🕐 Preferred Time *
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      disabled={availableSlots.length === 0}
                    >
                      <option value="">{selectedDate ? (availableSlots.length > 0 ? 'Choose available time' : 'No slots available') : 'Select a date first'}</option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {selectedDate && availableSlots.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">⚠️ No available slots for this date</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Available time slots for selected date</p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  💳 Payment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                    >
                      <option value="jeeb">Jeeb</option>
                      <option value="evc">EVC</option>
                      <option value="edahab">Edahab</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose your preferred payment method</p>
                  </div>
                  {/* Payment Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Number *
                    </label>
                    <input
                      type="text"
                      name="paymentNumber"
                      value={formData.paymentNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default: 0612103585 (edit if needed)</p>
                  </div>
                  {/* Payment Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      name="paymentAmount"
                      value={formData.paymentAmount}
                      readOnly
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg bg-gray-100 text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default: $10</p>
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUserMd className="text-blue-500" />
                  Medical Information
                </h4>
                
                {/* Reason for Visit */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏥 Primary Reason for Visit *
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Please describe your main reason for seeking medical consultation (e.g., routine checkup, specific health concern, follow-up visit)"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Be as detailed as possible to help the doctor prepare</p>
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🤒 Current Symptoms (Optional)
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe any symptoms you're currently experiencing (e.g., pain, fever, fatigue, etc.)"
                    className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include duration and severity of symptoms if applicable</p>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  Contact Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📞 Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">We'll use this to confirm your appointment</p>
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full border border-gray-300 px-3 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">For appointment reminders and updates</p>
                  </div>
                </div>
              </div>

              {/* Emergency Section */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500" />
                  Emergency Information
                </h4>
                
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="isEmergency"
                    checked={formData.isEmergency}
                    onChange={handleInputChange}
                    className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      🚨 This is an emergency appointment
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Check this if you need immediate medical attention. Emergency appointments will be prioritized.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-1">
                <button
                  type="submit"
                  disabled={submitting || !selectedDate || !selectedTime}
                  className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 py-4 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                      Processing Your Booking...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaCalendar />
                      Confirm Appointment Booking
                    </span>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                By booking this appointment, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorBooking;