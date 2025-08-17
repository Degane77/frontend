import React, { useState, useEffect } from 'react';
import ChatWindow from '../Components/ChatWindow';
import axios from 'axios';

const DoctorMessages = ({ userId }) => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/messages/conversation-list').then(res => setConversations(res.data));
  }, []);

  useEffect(() => {
    if (selected) {
      setLoading(true);
      axios.get(`/api/messages/conversation/${selected._id}`).then(res => {
        setMessages(res.data);
        setLoading(false);
      });
    }
  }, [selected]);

  const handleSend = async (content, file, type = 'text') => {
    const formData = new FormData();
    formData.append('receiver', selected._id);
    formData.append('content', content);
    formData.append('type', type);
    if (file) formData.append('attachments', file);
    await axios.post('/api/messages', formData);
    const res = await axios.get(`/api/messages/conversation/${selected._id}`);
    setMessages(res.data);
  };

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
            canUpload={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default DoctorMessages;
