'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function Sidebar() {
  const { assignments } = useStore();
  const router = useRouter();
  const assignmentCount = Object.keys(assignments).length;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-10 shadow-sm">
      <div className="p-6">
        <div className="text-xl font-bold flex items-center gap-2 text-gray-900 mb-8 tracking-tight cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-[#FF6A3D] text-white p-1 rounded flex items-center justify-center w-8 h-8 font-black text-lg">V</div> 
          VedaAI
        </div>
        
        <button onClick={() => router.push('/create')} className="w-full bg-[#2A2A2A] text-white rounded-full py-3 px-4 font-semibold text-[13px] flex items-center justify-center gap-2 border-[1.5px] border-[#FF6A3D] shadow-sm mb-8 hover:bg-black transition-colors">
          <span className="text-[#FF6A3D] text-lg font-light leading-none">+</span> Create Assignment
        </button>

        <nav className="space-y-1.5">
          {['Home', 'My Groups'].map(item => (
            <Link href="/" key={item} className="flex items-center gap-3 px-3 py-2.5 text-gray-500 font-medium rounded-xl hover:bg-gray-50 text-[13px] transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div> {item}
            </Link>
          ))}
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 bg-gray-100 text-gray-900 font-bold rounded-xl text-[13px] relative transition-colors">
            <div className="w-4 h-4 bg-gray-800 rounded-sm"></div> Assignments
            {assignmentCount > 0 && (
              <span className="absolute right-3 bg-[#FF6A3D] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {assignmentCount}
              </span>
            )}
          </Link>
          {['AI Teacher\'s Toolkit', 'My Library'].map(item => (
            <Link href="/" key={item} className="flex items-center gap-3 px-3 py-2.5 text-gray-500 font-medium rounded-xl hover:bg-gray-50 text-[13px] transition-colors">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div> {item}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-gray-500 font-medium rounded-xl hover:bg-gray-50 text-[13px] transition-colors">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div> Settings
        </Link>
        <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3 border border-gray-100 mt-2 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex-shrink-0 overflow-hidden border border-gray-200">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" alt="avatar" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[12px] font-bold text-gray-900 truncate">VedaAI Admin</div>
            <div className="text-[10px] text-gray-500 truncate mt-0.5">Instructor Console</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
