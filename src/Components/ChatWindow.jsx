import React, { useState, useRef, useEffect } from 'react';
import { FaPaperclip, FaPaperPlane, FaFilePdf, FaCheckCircle } from 'react-icons/fa';
import clsx from 'clsx';

const ChatWindow = ({
  messages = [],
  onSend,
  onFile,
  currentUserId,
  loading,
  inputPlaceholder = 'Type message...',
  canUpload = true
}) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    onSend(input, file);
    setInput('');
    setFile(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className={clsx(
            'flex',
            msg.sender?._id === currentUserId ? 'justify-end' : 'justify-start'
          )}>
            <div className={clsx(
              'rounded-lg px-4 py-2 max-w-xs break-words',
              msg.sender?._id === currentUserId ? 'bg-blue-500 text-white' : 'bg-white border'
            )}>
              <div className="flex items-center gap-2 mb-1">
                {msg.type === 'prescription' && <FaFilePdf className="text-red-500" title="Prescription" />}
                {msg.type === 'info' && <FaCheckCircle className="text-green-500" title="Info" />}
                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
              <div>{msg.content}</div>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.attachments.map((att, i) => (
                    <a key={i} href={`/${att.path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs flex items-center gap-1">
                      <FaPaperclip /> {att.filename}
                    </a>
                  ))}
                </div>
              )}
              {msg.read && <span className="text-xs text-green-600 ml-2">Read</span>}
            </div>
          </div>
        ))}
        {loading && <div className="text-center text-gray-400">Loading...</div>}
      </div>
      <form className="p-2 border-t flex gap-2" onSubmit={handleSend}>
        {canUpload && (
          <label className="flex items-center cursor-pointer">
            <FaPaperclip className="text-gray-500 mr-2" />
            <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        )}
        <input
          className="flex-1 border rounded p-2"
          placeholder={inputPlaceholder}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaPaperPlane /> Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
