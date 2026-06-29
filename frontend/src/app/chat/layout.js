'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

export default function ChatLayout({ children }) {
  const [channels, setChannels] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));

    const fetchChannels = async () => {
      try {
        const response = await api.get('/channels');
        setChannels(response.data);
        
        // Join socket rooms for all channels
        if (socket) {
          const channelIds = response.data.map(c => c.channel_id);
          socket.emit('join_channels', channelIds);
        }
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      }
    };

    fetchChannels();
  }, [router, socket]);

  if (!user) return null; // or a loading spinner

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar channels={channels} user={user} />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {children}
      </main>
    </div>
  );
}
