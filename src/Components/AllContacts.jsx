import { useEffect, useState } from 'react';

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contacts');
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">All Contact Messages</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-600">No contacts submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {contacts.map(contact => (
            <div key={contact._id} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
              <p><span className="font-semibold">Name:</span> {contact.fullName}</p>
              <p><span className="font-semibold">Email:</span> {contact.email}</p>
              <p><span className="font-semibold">Phone:</span> {contact.phone || 'N/A'}</p>
              <p><span className="font-semibold">Message:</span> {contact.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Submitted on: {new Date(contact.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContacts;
