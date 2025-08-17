import React, { useState, useEffect } from 'react';
import ChatWindow from '../Components/ChatWindow';
import axios from 'axios';

const UserMessages = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/messages/conversation-list')
      .then(res => setConversations(res.data))
      .catch(() => setError('Failed to load conversations.'));
  }, []);

  useEffect(() => {
    if (selected) {
      setLoading(true);
      axios.get(`/api/messages/conversation/${selected._id}`)
        .then(res => setMessages(res.data))
        .catch(() => setError('Failed to load messages.'))
        .finally(() => setLoading(false));
    }
  }, [selected]);

  const handleSend = async (content, file) => {
    const formData = new FormData();
    formData.append('receiver', selected._id);
    formData.append('content', content);
    if (file) formData.append('attachments', file);
    await axios.post('/api/messages', formData);
    // Refresh messages
    const res = await axios.get(`/api/messages/conversation/${selected._id}`);
    setMessages(res.data);
  };

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="flex h-full">
      <div className="w-64 border-r bg-white">
        <h2 className="font-bold p-4">Conversations</h2>
        <ul>
          {conversations.map(conv => (
            <li key={conv._id} className={selected?._id === conv._id ? 'bg-blue-100' : ''}>
              <button className="w-full text-left p-2" onClick={() => setSelected(conv)}>
                {conv.fullName || conv.email}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        {selected ? (
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            currentUserId={userId}
            loading={loading}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
