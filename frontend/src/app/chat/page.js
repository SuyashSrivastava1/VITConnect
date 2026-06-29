import { Hash } from 'lucide-react';

export default function ChatIndexPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 h-full">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
        <Hash className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-xl font-medium text-slate-300">Welcome to VITConnect</h3>
      <p className="mt-2 max-w-md text-center text-sm">
        Select a provisioned channel from the sidebar to start messaging. 
        Your channels have been automatically configured based on your academic profile.
      </p>
    </div>
  );
}
