'use client';
import { Reply } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message, isOwn, replyMsg, onReply }) {
  // Try to format time, fallback to simple string if date-fns fails
  let timeString = '';
  try {
    const date = new Date(message.sent_at);
    timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    timeString = '';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} group w-full`}
    >
      {/* Sender Name (only if not own message) */}
      {!isOwn && (
        <span className="text-xs text-slate-400 ml-12 mb-1 font-medium">
          {message.sender?.display_name || 'Unknown User'}
        </span>
      )}

      <div className={`flex items-end max-w-[85%] sm:max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm
          ${isOwn 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 ml-3' 
            : 'bg-gradient-to-br from-slate-600 to-slate-700 mr-3'
          }`}
        >
          {message.sender?.display_name?.charAt(0) || 'U'}
        </div>

        {/* Bubble Container */}
        <div className="flex flex-col min-w-0">
          
          {/* Quoted Reply */}
          {replyMsg && (
            <div className={`mb-1 px-3 py-2 text-sm rounded-lg opacity-80 border-l-2 truncate cursor-pointer hover:opacity-100 transition-opacity
              ${isOwn 
                ? 'bg-blue-900/40 text-blue-100 border-blue-400' 
                : 'bg-slate-800 text-slate-300 border-slate-500'
              }`}
            >
              <div className="font-medium text-xs mb-0.5">
                {replyMsg.sender?.display_name}
              </div>
              <div className="truncate text-slate-400">
                {replyMsg.content}
              </div>
            </div>
          )}

          {/* Main Message Bubble */}
          <div className="flex items-center group/actions">
            
            {/* Reply Button (Left side if own, right if other) */}
            {isOwn && (
              <button 
                onClick={onReply}
                className="mr-2 p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full opacity-0 group-hover/actions:opacity-100 transition-all shrink-0"
                title="Reply"
              >
                <Reply className="w-4 h-4" />
              </button>
            )}

            <div className={`px-4 py-2.5 rounded-2xl whitespace-pre-wrap break-words shadow-sm relative text-[15px] leading-relaxed
              ${isOwn 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-slate-800 text-slate-100 border border-slate-700/50 rounded-bl-sm'
              }`}
            >
              {message.content}
              <span className={`float-right text-[10px] ml-4 mt-2 font-medium opacity-70 ${isOwn ? 'text-blue-200' : 'text-slate-400'}`}>
                {timeString}
              </span>
            </div>

            {/* Reply Button (Right side if other) */}
            {!isOwn && (
              <button 
                onClick={onReply}
                className="ml-2 p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full opacity-0 group-hover/actions:opacity-100 transition-all shrink-0"
                title="Reply"
              >
                <Reply className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
