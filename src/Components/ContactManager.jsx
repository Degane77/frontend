import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMsg, setReplyMsg] = useState('');
  const [replyId, setReplyId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contacts');
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleReply = async (contactId) => {
    if (!replyMsg.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${contactId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyMsg })
      });
      if (res.ok) {
        setContacts(contacts =>
          contacts.map(c =>
            c._id === contactId ? { ...c, reply: replyMsg } : c
          )
        );
        setReplyMsg('');
        setReplyId(null);
      }
    } catch {
      // handle error if needed
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Contact Manager</h2>
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
                  Submitted on: {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'N/A'}
                </p>
                {/* Reply Section */}
                <div className="mt-4">
                  {contact.reply ? (
                    <div className="text-green-600 font-semibold">
                      Reply: {contact.reply}
                    </div>
                  ) : replyId === contact._id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={replyMsg}
                        onChange={e => setReplyMsg(e.target.value)}
                        placeholder="Type your reply..."
                        className="border p-2 rounded flex-1"
                      />
                      <button
                        onClick={() => handleReply(contact._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => { setReplyId(null); setReplyMsg(''); }}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyId(contact._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ContactManager;