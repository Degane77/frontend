import { useState } from 'react';
import { sendMessage } from '../services/messageService';

const UserSendMessage = ({ receiverId, receiverName, onSent }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');

  // Get sender info from localStorage
  const sender = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) return;
    if (!sender || !sender._id) {
      setMsg('❌ You must be logged in to send messages.');
      return;
    }
    setSending(true);
    setMsg('');
    try {
      const formData = new FormData();
      formData.append('receiver', receiverId);
      formData.append('content', content);
      formData.append('sender', sender._id); // Attach sender id
      if (file) formData.append('attachments', file);
      await sendMessage(formData);
      setMsg('✅ Message sent');
      setContent('');
      setFile(null);
      if (onSent) onSent();
    } catch {
      setMsg('❌ Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-2 bg-blue-50 p-4 rounded shadow mt-2">
      <div className="font-semibold">Send message to: <span className="text-blue-700">{receiverName}</span></div>
      <textarea
        className="border rounded p-2"
        placeholder="Type your message..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" disabled={sending}>
        {sending ? 'Sending...' : 'Send Message'}
      </button>
      {msg && <div className={msg.startsWith('✅') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{msg}</div>}
    </form>
  );
};

export default UserSendMessage;
