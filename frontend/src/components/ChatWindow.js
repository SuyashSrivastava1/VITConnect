'use client';
import { useEffect, useState, useRef } from 'react';
import { Send, Reply, X } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import api from '@/lib/api';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ channelId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/channels/${channelId}/messages`);
        setMessages(res.data);
        scrollToBottom();
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    
    if (channelId) {
      fetchMessages();
    }
  }, [channelId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.channel_id === channelId) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, channelId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    const messageData = {
      channel_id: channelId,
      sender_id: user.user_id,
      content: newMessage.trim(),
      reply_to: replyTo?.msg_id || null
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
    setReplyTo(null);
  };

  const getReplyMessage = (replyId) => {
    return messages.find(m => m.msg_id === replyId);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-900">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble 
              key={msg.msg_id} 
              message={msg} 
              isOwn={msg.sender_id === user?.user_id}
              replyMsg={msg.reply_to ? getReplyMessage(msg.reply_to) : null}
              onReply={() => setReplyTo(msg)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Reply Context Bar */}
          {replyTo && (
            <div className="flex items-center justify-between bg-slate-800 rounded-t-lg px-4 py-2 border-l-4 border-blue-500 text-sm mb-[-1px]">
              <div className="flex items-center text-slate-300 truncate pr-4">
                <Reply className="w-4 h-4 mr-2 text-slate-500" />
                <span className="font-medium mr-2 text-blue-400">{replyTo.sender?.display_name}:</span>
                <span className="truncate text-slate-400">{replyTo.content}</span>
              </div>
              <button 
                onClick={() => setReplyTo(null)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Form */}
          <form 
            onSubmit={handleSendMessage} 
            className={`flex items-end bg-slate-800 border ${replyTo ? 'border-t-0 rounded-b-xl rounded-tr-xl' : 'rounded-xl'} border-slate-700 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-sm`}
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 max-h-32 min-h-[44px] resize-none custom-scrollbar outline-none"
              rows={1}
            />
            <div className="p-2">
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md shadow-blue-900/20"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
             <span className="text-xs text-slate-600">Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
