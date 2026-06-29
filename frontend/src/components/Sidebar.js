'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Hash, LogOut, BookOpen, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar({ channels, user }) {
  const params = useParams();
  const currentChannelId = params?.channelId;
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const officialChannels = channels.filter(c => c.type === 'official');
  const courseChannels = channels.filter(c => c.type === 'course');

  const ChannelLink = ({ channel, icon: Icon }) => {
    const isActive = currentChannelId === channel.channel_id;
    return (
      <Link 
        href={`/chat/${channel.channel_id}`}
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
          isActive 
            ? 'bg-blue-600/20 text-blue-400' 
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
        <span className="font-medium truncate">{channel.name}</span>
      </Link>
    );
  };

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          VITConnect
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {/* Official Channels */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Official Channels
          </h3>
          <div className="space-y-1">
            {officialChannels.map(channel => (
              <ChannelLink key={channel.channel_id} channel={channel} icon={Building2} />
            ))}
          </div>
        </div>

        {/* Course Channels */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Course Channels
          </h3>
          <div className="space-y-1">
            {courseChannels.map(channel => (
              <ChannelLink key={channel.channel_id} channel={channel} icon={BookOpen} />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate pr-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.display_name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.display_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.reg_no}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
