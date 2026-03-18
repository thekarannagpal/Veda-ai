'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`)
      .then(res => res.json())
      .then(data => {
        // Sort newest first
        const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAssignments(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch assignments', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Header Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 absolute opacity-0 sm:static sm:opacity-100 hidden sm:block">Assignments</h1>
        
        <div className="flex w-full sm:w-auto gap-3 flex-1 sm:max-w-md">
           <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex-shrink-0 transition-colors">
              <Filter className="w-4 h-4" /> Filter
           </button>
           <div className="relative flex-1">
             <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
             <input type="text" placeholder="Search Name" className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-gray-400 shadow-sm" />
           </div>
        </div>
      </div>

      <div className="space-y-4 relative pb-24">
        {loading ? (
             Array.from({length: 4}).map((_, i) => (
                <div key={i} className="h-28 bg-white border border-gray-100 rounded-[28px] animate-pulse"></div>
             ))
        ) : assignments.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-[32px] border border-gray-100 text-gray-500 shadow-sm col-span-full">
            <div className="w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mx-auto mb-4 flex items-center justify-center text-gray-400">?</div>
            <p className="font-bold text-gray-900 text-lg mb-1">Your Library is Empty</p>
            <p className="text-sm font-medium">Create your first AI assignment to see it here.</p>
          </div>
        ) : (
          assignments.map((assignment: any) => (
            <Link href={`/assignments/${assignment._id}`} key={assignment._id} className="block group">
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-[17px] text-gray-900 group-hover:text-[#FF6A3D] transition-colors">{assignment.title || 'Untitled Assessment'}</h3>
                  <button className="text-gray-400 hover:text-gray-900 mt-1 transition-colors"><MoreVertical className="w-5 h-5"/></button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[13px] font-bold text-gray-500">
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    Assigned on: <span className="text-gray-800">{new Date(assignment.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    Due: <span className="text-gray-800">{new Date(assignment.dueDate).toLocaleDateString('en-GB')}</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#FF6A3D]'}`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
        
        {/* Floating Action Button for Mobile / Small Screens */}
        <button onClick={(e) => { e.preventDefault(); router.push('/create'); }} className="fixed sm:absolute bottom-6 right-6 sm:bottom-4 sm:right-2 w-16 h-16 bg-[#FF6A3D] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors z-50 hover:scale-105 active:scale-95 duration-200">
          <Plus className="w-8 h-8" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
