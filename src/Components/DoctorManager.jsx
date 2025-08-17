import { useState, useEffect } from 'react';
import { 
  FaUserMd, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaFileAlt, 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaBuilding, 
  FaImage, 
  FaUser, 
  FaChevronLeft, 
  FaChevronRight, 
  FaSortAmountDown, 
  FaSortAmountUp, 
  FaFileExport, 
  FaFileCsv, 
  FaFilePdf, 
  FaEnvelopeOpen, 
  FaChartBar, 
  FaCheckDouble, 
  FaTrashAlt,
  FaArrowLeft,
  FaSignOutAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/cafye-logo.png';

const DoctorManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    specialty: '',
    workplace: '',
    educationLevel: 'Bachelor',
    phone: '',
    email: '',
    address: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [doctorImage, setDoctorImage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  // Sorting state
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');

  // Bulk operations state
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    bySpecialty: {},
    byEducation: {}
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    calculateAnalytics();
  }, [doctors]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching doctors...');
      
      const token = localStorage.getItem('token');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/doctors', {
        headers
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please login as admin.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          const errorText = await response.text();
          console.error('❌ Server response:', errorText);
          throw new Error(`Failed to fetch doctors: ${response.status} - ${errorText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Doctors data received:', data);
      
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      setError(err.message || 'Failed to fetch doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    const analytics = {
      total: doctors.length,
      verified: doctors.filter(d => d.isVerified).length,
      unverified: doctors.filter(d => !d.isVerified).length,
      bySpecialty: {},
      byEducation: {}
    };

    doctors.forEach(doctor => {
      if (doctor.specialty) {
        analytics.bySpecialty[doctor.specialty] = (analytics.bySpecialty[doctor.specialty] || 0) + 1;
      }
      
      if (doctor.educationLevel) {
        analytics.byEducation[doctor.educationLevel] = (analytics.byEducation[doctor.educationLevel] || 0) + 1;
      }
    });

    setAnalytics(analytics);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Specialty', 'Workplace', 'Education', 'Phone', 'Email', 'Address', 'Verified', 'Date Added'];
    const csvData = sortedDoctors.map(doctor => [
      doctor.fullName,
      doctor.specialty,
      doctor.workplace || '',
      doctor.educationLevel || '',
      doctor.phone || '',
      doctor.email || '',
      doctor.address || '',
      doctor.isVerified ? 'Yes' : 'No',
      new Date(doctor.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctors_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showSuccess('CSV exported successfully!');
  };

  // Export to PDF
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Doctors Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Doctors Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Workplace</th>
                <th>Education</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              ${sortedDoctors.map(doctor => `
                <tr>
                  <td>${doctor.fullName}</td>
                  <td>${doctor.specialty}</td>
                  <td>${doctor.workplace || '-'}</td>
                  <td>${doctor.educationLevel || '-'}</td>
                  <td>${doctor.isVerified ? 'Yes' : 'No'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
    showSuccess('PDF generated successfully!');
  };

  // Bulk operations
  const handleBulkVerify = async () => {
    if (!window.confirm(`Are you sure you want to verify ${selectedDoctors.length} doctors?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const promises = selectedDoctors.map(id => 
        fetch(`/api/doctors/${id}/verify`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      );
      
      await Promise.all(promises);
      setSelectedDoctors([]);
      await fetchDoctors();
      showSuccess(`${selectedDoctors.length} doctors verified successfully!`);
    } catch (err) {
      showError('Failed to verify doctors');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedDoctors.length} doctors?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const promises = selectedDoctors.map(id => 
        fetch(`/api/doctors/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );
      
      await Promise.all(promises);
      setSelectedDoctors([]);
      await fetchDoctors();
      showSuccess(`${selectedDoctors.length} doctors deleted successfully!`);
    } catch (err) {
      showError('Failed to delete doctors');
    }
  };

  const handleSelectDoctor = (doctorId) => {
    setSelectedDoctors(prev => 
      prev.includes(doctorId) 
        ? prev.filter(id => id !== doctorId) 
        : [...prev, doctorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDoctors.length === currentDoctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(currentDoctors.map(d => d._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Authentication required. Please login as admin.');
        return;
      }
      
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (certificateFile) {
        formDataToSend.append('certificateFile', certificateFile);
      }
      if (doctorImage) {
        formDataToSend.append('doctorImage', doctorImage);
      }

      const url = selectedDoctor ? `/api/doctors/${selectedDoctor._id}` : '/api/doctors';
      const method = selectedDoctor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || (selectedDoctor ? 'Failed to update doctor' : 'Failed to create doctor'));
      }
      
      await fetchDoctors();
      setShowModal(false);
      setSelectedDoctor(null);
      setFormData({
        fullName: '',
        specialty: '',
        workplace: '',
        educationLevel: 'Bachelor',
        phone: '',
        email: '',
        address: ''
      });
      setCertificateFile(null);
      setDoctorImage(null);
      showSuccess(selectedDoctor ? 'Doctor updated successfully!' : 'Doctor created successfully!');
    } catch (err) {
      console.error('Error saving doctor:', err);
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Authentication required. Please login as admin.');
        return;
      }
      
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete doctor');
      }
      
      await fetchDoctors();
      showSuccess('Doctor deleted successfully!');
    } catch (err) {
      console.error('Error deleting doctor:', err);
      showError(err.message);
    }
  };

  const handleVerify = async (id) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Authentication required. Please login as admin.');
        return;
      }
      
      const response = await fetch(`/api/doctors/${id}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to verify doctor');
      }
      
      await fetchDoctors();
      showSuccess('Doctor verified successfully!');
    } catch (err) {
      console.error('Error verifying doctor:', err);
      showError(err.message);
    }
  };

  const viewCertificate = async (doctorId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Authentication required. Please login as admin.');
        return;
      }
      
      const response = await fetch(`/api/doctors/${doctorId}/certificate/view`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to view certificate');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error viewing certificate:', err);
      showError(err.message);
    }
  };

  const downloadCertificate = async (doctorId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showError('Authentication required. Please login as admin.');
        return;
      }
      
      const response = await fetch(`/api/doctors/${doctorId}/certificate/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download certificate');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showSuccess('Certificate downloaded successfully!');
    } catch (err) {
      console.error('Error downloading certificate:', err);
      showError(err.message);
    }
  };

  // Sorting function
  const sortDoctors = (doctors) => {
    return doctors.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Filter and sort doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.workplace?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'verified' && doctor.isVerified) ||
                         (filterStatus === 'unverified' && !doctor.isVerified);
    
    return matchesSearch && matchesFilter;
  });

  const sortedDoctors = sortDoctors([...filteredDoctors]);

  // Pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = sortedDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(sortedDoctors.length / doctorsPerPage);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020024] to-[#043860] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading doctors...</p>
          </div>
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
              <h1 className="text-2xl font-bold text-green-400">Doctor Management</h1>
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
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-2xl text-green-400" />
            <h2 className="text-xl font-semibold">Manage Doctors</h2>
          </div>
          <div className="flex gap-3">
            <Link
              to="/doctorform"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <FaPlus /> Add Doctor
            </Link>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <FaCheckDouble /> Bulk Operations
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Doctors</p>
                <p className="text-3xl font-bold text-white">{analytics.total}</p>
              </div>
              <FaUserMd className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Verified</p>
                <p className="text-3xl font-bold text-green-400">{analytics.verified}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{analytics.unverified}</p>
              </div>
              <FaTimesCircle className="text-3xl text-yellow-500" />
            </div>
          </div>
          <div className="bg-[#010a2b] rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Specialties</p>
                <p className="text-3xl font-bold text-purple-400">{Object.keys(analytics.bySpecialty).length}</p>
              </div>
              <FaChartBar className="text-3xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900 border border-red-400 text-red-200 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <button onClick={() => setError(null)} className="float-right font-bold text-red-200 hover:text-red-100">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-900 border border-green-400 text-green-200 px-4 py-3 rounded mb-6">
            <strong>Success:</strong> {success}
            <button onClick={() => setSuccess(null)} className="float-right font-bold text-green-200 hover:text-green-100">
              ×
            </button>
          </div>
        )}

        {/* Search, Filter, Sort, and Export */}
        <div className="bg-[#010a2b] rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            >
              <option value="all">All Doctors</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Sort Field */}
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
            >
              <option value="fullName">Name</option>
              <option value="specialty">Specialty</option>
              <option value="workplace">Workplace</option>
              <option value="educationLevel">Education</option>
              <option value="createdAt">Date Added</option>
            </select>

            {/* Sort Direction */}
            <button
              onClick={() => handleSort(sortField)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#020024] border border-gray-600 rounded-lg hover:bg-[#030035] transition-colors text-white"
            >
              {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </button>

            {/* Export */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="Export to CSV"
              >
                <FaFileCsv /> CSV
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Export to PDF"
              >
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {indexOfFirstDoctor + 1}-{Math.min(indexOfLastDoctor, sortedDoctors.length)} of {sortedDoctors.length} doctors
          </div>
        </div>

        {/* Bulk Operations Bar */}
        {selectedDoctors.length > 0 && (
          <div className="bg-blue-900 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-blue-200 font-medium">
                  {selectedDoctors.length} doctor(s) selected
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-blue-300 hover:text-blue-100 text-sm"
                >
                  {selectedDoctors.length === currentDoctors.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkVerify}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FaCheckCircle /> Verify Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <FaTrashAlt /> Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className={`bg-[#010a2b] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                selectedDoctors.includes(doctor._id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Doctor Header with Image */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {doctor.doctorImage?.filename ? (
                      <img
                        src={` https://backend-voz7.onrender.com/uploads/doctors/${doctor.doctorImage.filename}`}
                        alt={doctor.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{doctor.fullName}</h3>
                      <p className="text-blue-100">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDoctors.includes(doctor._id)}
                      onChange={() => handleSelectDoctor(doctor._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    {doctor.isVerified ? (
                      <FaCheckCircle className="text-green-300 text-xl" title="Verified" />
                    ) : (
                      <FaTimesCircle className="text-red-300 text-xl" title="Unverified" />
                    )}
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {doctor.workplace && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaBuilding className="text-green-500" />
                      <span className="text-sm">{doctor.workplace}</span>
                    </div>
                  )}
                  {doctor.educationLevel && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaGraduationCap className="text-green-500" />
                      <span className="text-sm">{doctor.educationLevel}</span>
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaPhone className="text-green-500" />
                      <span className="text-sm">{doctor.phone}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaEnvelope className="text-green-500" />
                      <span className="text-sm">{doctor.email}</span>
                    </div>
                  )}
                  {doctor.address && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <FaMapMarkerAlt className="text-green-500" />
                      <span className="text-sm">{doctor.address}</span>
                    </div>
                  )}
                </div>

                {/* Certificate Section */}
                {doctor.certificateFile && doctor.certificateFile.filename && (
                  <div className="bg-[#020024] rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileAlt className="text-blue-500" />
                      <span className="font-semibold text-sm text-white">Certificate</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">
                      {doctor.certificateFile.originalName} • {Math.round(doctor.certificateFile.size / 1024)}KB
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewCertificate(doctor._id)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => downloadCertificate(doctor._id)}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs font-semibold"
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    {!doctor.isVerified && (
                      <button
                        onClick={() => handleVerify(doctor._id)}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs font-semibold"
                      >
                        <FaCheckCircle /> Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-semibold"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                  <Link
                    to={`/doctorform/${doctor._id}`}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold"
                  >
                    <FaEdit /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-[#010a2b] border border-gray-600 rounded-lg hover:bg-[#020024] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft /> Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 bg-[#010a2b] border border-gray-600 hover:bg-[#020024]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-400 bg-[#010a2b] border border-gray-600 rounded-lg hover:bg-[#020024] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <FaChevronRight />
              </button>
            </nav>
          </div>
        )}

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <FaUserMd className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No doctors have been added yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#010a2b] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">
                {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Workplace
                  </label>
                  <input
                    type="text"
                    value={formData.workplace}
                    onChange={(e) => setFormData({...formData, workplace: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Education Level
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>

                {/* File Upload Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Doctor Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDoctorImage(e.target.files[0])}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Certificate File
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    className="w-full px-3 py-2 bg-[#020024] border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    {submitting ? 'Saving...' : (selectedDoctor ? 'Update' : 'Add')} Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedDoctor(null);
                      setFormData({
                        fullName: '',
                        specialty: '',
                        workplace: '',
                        educationLevel: 'Bachelor',
                        phone: '',
                        email: '',
                        address: ''
                      });
                      setCertificateFile(null);
                      setDoctorImage(null);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;

