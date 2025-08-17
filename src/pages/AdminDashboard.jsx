import { useEffect, useState } from 'react';
import { getAllMessages } from '../services/messageService';
import { Link } from 'react-router-dom';
import {
  FaUser,
  FaUserMd,
  FaBook,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaStethoscope,
  FaBars,
  FaChartLine,
  FaBell,
  FaEye,
  FaEdit,
  FaTrash,
  FaNewspaper,
  FaCalendarAlt
} from 'react-icons/fa';
import logo from '../assets/cafye-logo.png';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageManagerOpen, setMessageManagerOpen] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [showOnlyUserMessages, setShowOnlyUserMessages] = useState(false);
  // Fetch all messages for message manager
  const fetchAllMessages = async () => {
    setMsgLoading(true);
    try {
      const res = await getAllMessages();
      setAllMessages(res.data);
    } catch {
      setAllMessages([]);
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch counts
        const [usersRes, doctorsRes, contactsRes, bookingsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/doctors'),
          fetch('/api/contacts'),
          fetch('/api/bookings/admin/all')
        ]);

        const users = await usersRes.json();
        const doctors = await doctorsRes.json();
        const contacts = await contactsRes.json();
        const bookings = await bookingsRes.json();

        setTotalUsers(users.length);
        setTotalDoctors(doctors.length);
        setTotalContacts(contacts.length);
        setTotalBookings(bookings.length);

        // Get recent users and doctors
        setRecentUsers(users.slice(-5).reverse());
        setRecentDoctors(doctors.slice(-5).reverse());
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020024] to-[#043860]">
        <div className="text-white text-2xl">Loading Dashboard...</div>
      </div>
    );
  }

  // Message Manager UI
  if (messageManagerOpen) {
    // Filter messages sent by users (role === 'user')
    const userMessages = allMessages.filter(msg => msg.sender?.role === 'user');
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#020024] to-[#043860] text-white">
        <div className="flex-1 p-6 sm:p-8">
          <button className="mb-4 bg-gray-200 text-black px-4 py-2 rounded" onClick={() => setMessageManagerOpen(false)}>
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold mb-4">Message Manager</h2>
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${!showOnlyUserMessages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setShowOnlyUserMessages(false)}
            >
              All Messages
            </button>
            <button
              className={`px-4 py-2 rounded ${showOnlyUserMessages ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setShowOnlyUserMessages(true)}
            >
              User Sent Messages
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={fetchAllMessages}>Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border text-black">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">From</th>
                  <th className="px-4 py-2 border">To</th>
                  <th className="px-4 py-2 border">Content</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {(showOnlyUserMessages ? userMessages : allMessages).map(msg => (
                  <tr key={msg._id}>
                    <td className="border px-2 py-1">{msg.sender?.fullName || msg.sender?.name || msg.sender?.email}</td>
                    <td className="border px-2 py-1">{msg.receiver?.fullName || msg.receiver?.name || msg.receiver?.email}</td>
                    <td className="border px-2 py-1">{msg.content}</td>
                    <td className="border px-2 py-1">{new Date(msg.createdAt).toLocaleString()}</td>
                    <td className="border px-2 py-1">{msg.read ? 'Read' : 'Unread'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {msgLoading && <div className="text-center text-gray-400">Loading...</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] text-white">
      {/* Mobile top bar */}
  <div className="flex items-center justify-between p-4 md:hidden bg-[#1e293b] shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="Cafiye Logo" className="w-8 h-8 mr-2" />
          <h2 className="text-xl font-bold text-green-400">Cafiye Admin</h2>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
  <aside className={`bg-[#1e293b] p-6 shadow-2xl md:w-64 w-full md:block ${sidebarOpen ? 'block' : 'hidden'} md:h-auto rounded-b-3xl md:rounded-none`}>
  <div className="flex items-center mb-8">
          <img src={logo} alt="Cafiye Logo" className="w-10 h-10 mr-3" />
          <h1 className="text-xl font-bold text-green-400">Admin Panel</h1>
        </div>
        
  <nav className="flex flex-col gap-4 text-[1.1rem] font-semibold">
          <Link to="/admindashboard" className="flex items-center gap-3 hover:bg-blue-600 hover:text-white transition bg-blue-500 bg-opacity-20 p-3 rounded-xl shadow-md">
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/usermanager" className="flex items-center gap-3 hover:bg-green-600 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaUser /> User Manager
          </Link>
          {/* <Link to="/doctormanager" className="flex items-center gap-3 hover:text-yellow-400 transition p-3 rounded-lg">
            <FaUserMd /> Doctor Manager
          </Link> */}
          <Link to="/doctorform" className="flex items-center gap-3 hover:bg-purple-600 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaUserMd /> Doctor Mnager
          </Link>
          <Link to="/articlemanager" className="flex items-center gap-3 hover:bg-orange-600 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaNewspaper /> Article Manager
          </Link>
          <Link to="/bookingmanager" className="flex items-center gap-3 hover:bg-purple-700 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaCalendarAlt /> Booking Manager
          </Link>
          <Link to="/contactmanager" className="flex items-center gap-3 hover:bg-pink-600 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaEnvelope /> Contact Manager
          </Link>
          <Link to="/chatadmin" className="flex items-center gap-3 hover:bg-cyan-600 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaEnvelope /> Chat Admin
          </Link>
          <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-700 hover:text-white transition p-3 rounded-xl shadow-md">
            <FaUserCircle /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
  <main className="flex-1 p-6 sm:p-8 bg-gradient-to-br from-[#1e293b] to-[#2563eb] rounded-t-3xl md:rounded-none shadow-2xl">
  <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition" onClick={() => { setMessageManagerOpen(true); fetchAllMessages(); }}>
              Message Manager
            </button>
            <div className="relative">
              <FaBell className="text-2xl text-yellow-400 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-700 p-6 rounded-2xl shadow-2xl border border-green-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-3xl font-bold mt-2">{totalUsers}</p>
                <p className="text-sm opacity-90 mt-1">+12% from last month</p>
              </div>
              <FaUsers className="text-white text-4xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-6 rounded-2xl shadow-2xl border border-blue-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Doctors</h3>
                <p className="text-3xl font-bold mt-2">{totalDoctors}</p>
                <p className="text-sm opacity-90 mt-1">+5% from last month</p>
              </div>
              <FaStethoscope className="text-white text-4xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 p-6 rounded-2xl shadow-2xl border border-orange-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Contacts</h3>
                <p className="text-3xl font-bold mt-2">{totalContacts}</p>
                <p className="text-sm opacity-90 mt-1">+15% from last month</p>
              </div>
              <FaEnvelope className="text-white text-4xl opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 p-6 rounded-2xl shadow-2xl border border-purple-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Bookings</h3>
                <p className="text-3xl font-bold mt-2">{totalBookings}</p>
                <p className="text-sm opacity-90 mt-1">+8% from last month</p>
              </div>
              <FaCalendarAlt className="text-white text-4xl opacity-80" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/doctorform" className="bg-gradient-to-br from-green-400 via-green-500 to-green-700 p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-green-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Add New Doctor</h3>
                <p className="text-sm opacity-90 mt-1">Register a new doctor</p>
              </div>
              <FaUserMd className="text-white text-4xl opacity-80" />
            </div>
          </Link>
          
          <Link to="/doctormanager" className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Doctors</h3>
                <p className="text-sm opacity-90 mt-1">View and edit doctors</p>
              </div>
              <FaStethoscope className="text-white text-4xl opacity-80" />
            </div>
          </Link>
          
          <Link to="/articlemanager" className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-orange-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Articles</h3>
                <p className="text-sm opacity-90 mt-1">Create and edit articles</p>
              </div>
              <FaNewspaper className="text-white text-4xl opacity-80" />
            </div>
          </Link>
          
          <Link to="/bookingmanager" className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-300/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Bookings</h3>
                <p className="text-sm opacity-90 mt-1">View and manage bookings</p>
              </div>
              <FaCalendarAlt className="text-white text-4xl opacity-80" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-2xl border border-blue-300/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-green-400" />
              Recent Users
            </h3>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={user._id || index} className="flex items-center justify-between p-3 bg-[#020024] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/doctorform/${doctor._id}`} className="p-2 text-yellow-400 hover:text-yellow-300">
                      <FaEdit />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Doctors */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-2xl border border-blue-300/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaStethoscope className="text-blue-400" />
              Recent Doctors
            </h3>
            <div className="space-y-4">
              {recentDoctors.map((doctor, index) => (
                <div key={doctor._id || index} className="flex items-center justify-between p-3 bg-[#020024] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaUserMd className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{doctor.fullName}</p>
                      <p className="text-sm text-gray-400">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300">
                      <FaEye />
                    </button>
                    <button className="p-2 text-yellow-400 hover:text-yellow-300">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
  <footer className="mt-16 text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} Cafiye Health - Admin Dashboard
        </footer>
  <footer className="mt-4 text-center text-yellow-500 text-lg sm:text-2xl font-semibold drop-shadow">
          © {new Date().getFullYear()} @ Dev Garaad Bashiir Hussein
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
