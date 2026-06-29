'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Hash, Users, Loader2 } from 'lucide-react';
import ChatWindow from '@/components/ChatWindow';
import api from '@/lib/api';

export default function ChannelPage() {
  const params = useParams();
  const { channelId } = params;
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        // Find channel details from the list (in a real app, you might have a specific endpoint for this)
        const res = await api.get('/channels');
        const currentChannel = res.data.find(c => c.channel_id === channelId);
        setChannel(currentChannel);
      } catch (error) {
        console.error('Failed to fetch channel:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (channelId) {
      fetchChannelDetails();
    }
  }, [channelId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        Channel not found or you don't have access.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Channel Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
            <Hash className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{channel.name}</h2>
            <p className="text-xs text-slate-400 capitalize">{channel.type} Channel</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-slate-400 hover:text-slate-300 cursor-pointer transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Members</span>
        </div>
      </div>

      {/* Chat Area */}
      <ChatWindow channelId={channelId} />
    </div>
  );
}
