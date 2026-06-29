'use client';
import { motion } from 'framer-motion';

export default function ProvisioningModal({ data }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-6" />
          
          <h2 className="text-xl font-bold text-white mb-2">Auto-Provisioning</h2>
          <p className="text-slate-400 text-sm mb-6">Analyzing academic profile and assigning channels...</p>
          
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-slate-400">Department</span>
              <span className="font-medium text-blue-400">{data.dept_code}</span>
            </div>
            <div className="flex items-center justify-between text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-slate-400">Batch Year</span>
              <span className="font-medium text-blue-400">{data.batch_year}</span>
            </div>
            <div className="flex items-center justify-between text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-slate-400">Section</span>
              <span className="font-medium text-teal-400">{data.section}</span>
            </div>
            <div className="flex items-center justify-between text-sm bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-slate-400">Courses Enrolled</span>
              <span className="font-medium text-purple-400">{data.course_list.length} Courses</span>
            </div>
          </div>
          
          <p className="mt-6 text-xs text-slate-500 animate-pulse">Entering secure workspace...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
