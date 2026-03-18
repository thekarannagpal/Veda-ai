'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle, FileText, Loader2, Plus, Minus } from 'lucide-react';

interface QuestionConfig {
  type: string;
  count: number;
  marks: number;
}

export default function CreateAssignmentForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [instructions, setInstructions] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [configs, setConfigs] = useState<QuestionConfig[]>([
      { type: 'Multiple Choice Questions', count: 4, marks: 1 },
      { type: 'Short Questions', count: 3, marks: 2 }
    ]);

    const availableTypes = ['Multiple Choice Questions', 'Short Questions', 'Diagram/Graph-Based Questions', 'Numerical Problems'];

    const totalQuestions = configs.reduce((acc, curr) => acc + curr.count, 0);
    const totalMarks = configs.reduce((acc, curr) => acc + (curr.count * curr.marks), 0);

    const updateConfig = (index: number, field: keyof QuestionConfig, val: any) => {
      const newConfigs = [...configs];
      newConfigs[index] = { ...newConfigs[index], [field]: val };
      setConfigs(newConfigs);
    };

    const addConfig = () => {
      setConfigs([...configs, { type: availableTypes[0], count: 1, marks: 1 }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title || 'New Assignment');
        formData.append('dueDate', dueDate);
        formData.append('questionTypes', JSON.stringify(configs.map(c => c.type)));
        formData.append('numberOfQuestions', totalQuestions.toString());
        formData.append('totalMarks', totalMarks.toString());
        formData.append('instructions', instructions);
        if (file) formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data._id) {
                router.push(`/assignments/${data._id}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Assignment <span className="text-gray-400 text-sm font-normal ml-2">Set up a new assignment for your students</span></h1>
            
            <div className="bg-white p-8 sm:p-10 rounded-[32px] shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8 border-b-2 border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900">Assignment Details</h2>
                <p className="text-gray-500 text-sm">Basic information about your assignment</p>
              </div>

              {/* Title Dropdown Simulator (Based on Due Date/Chapter look alike in Figma) */}
              <div className="mb-8">
                <input required type="text" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 outline-none transition-colors mb-2" placeholder="Title or Chapter (e.g. Quiz on Electricity)" />
              </div>

              {/* Drag and Drop */}
              <div className="mb-8">
                  <div className="relative w-full border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-10 hover:border-gray-300 transition-colors flex flex-col items-center justify-center cursor-pointer">
                      <input type="file" accept=".pdf,.txt,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      
                      <UploadCloud className="w-8 h-8 text-gray-600 mb-3" />
                      {file ? (
                          <div className="text-sm font-bold text-gray-900">{file.name}</div>
                      ) : (
                          <>
                            <div className="text-sm font-bold text-gray-800 mb-1">Choose a file or drag & drop it here</div>
                            <div className="text-xs text-gray-400 mb-4">JPEG, PNG, upto 10MB (PDF/Text supported)</div>
                            <button type="button" className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-sm pointer-events-none">
                              Browse Files
                            </button>
                          </>
                      )}
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-2">Upload images or preferred document/image</div>
              </div>

              {/* Due Date */}
              <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-800 mb-2">Due Date</label>
                  <input required type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 outline-none transition-colors text-gray-500" />
              </div>

              {/* Question Types Builder */}
              <div className="mb-8">
                  <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_120px_120px] gap-4 mb-3">
                    <label className="text-sm font-bold text-gray-800">Question Type</label>
                    <label className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-wider">No. of Questions</label>
                    <label className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-wider">Marks</label>
                  </div>

                  <div className="space-y-3">
                    {configs.map((config, idx) => (
                      <div key={idx} className="flex relative items-center gap-2 group">
                        
                        {/* Selector */}
                        <div className="flex-1 bg-[#F9FAFB] border border-gray-200 rounded-2xl flex items-center px-4 py-3 relative cursor-pointer">
                          <select value={config.type} onChange={(e) => updateConfig(idx, 'type', e.target.value)} className="w-full bg-transparent outline-none text-sm text-gray-700 appearance-none font-medium z-10">
                            {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>

                        {/* Remove button (shows on hover) */}
                        <button type="button" onClick={() => setConfigs(configs.filter((_, i) => i !== idx))} className="absolute -left-10 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        {/* Count Stepper */}
                        <div className="w-[80px] sm:w-[120px] flex items-center justify-between border border-gray-200 rounded-2xl px-2 py-3 bg-white">
                          <button type="button" onClick={() => updateConfig(idx, 'count', Math.max(1, config.count - 1))} className="text-gray-400 hover:text-gray-900 w-6 h-6 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold text-gray-800">{config.count}</span>
                          <button type="button" onClick={() => updateConfig(idx, 'count', config.count + 1)} className="text-gray-400 hover:text-gray-900 w-6 h-6 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        </div>

                        {/* Marks Stepper */}
                        <div className="w-[80px] sm:w-[120px] flex items-center justify-between border border-gray-200 rounded-2xl px-2 py-3 bg-white">
                          <button type="button" onClick={() => updateConfig(idx, 'marks', Math.max(1, config.marks - 1))} className="text-gray-400 hover:text-gray-900 w-6 h-6 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold text-gray-800">{config.marks}</span>
                          <button type="button" onClick={() => updateConfig(idx, 'marks', config.marks + 1)} className="text-gray-400 hover:text-gray-900 w-6 h-6 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={addConfig} className="mt-4 flex items-center text-sm font-bold text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                    <span className="bg-black text-white w-4 h-4 rounded-full flex items-center justify-center mr-2 text-xs font-light">+</span> Add Question Type
                  </button>

                  <div className="flex justify-end mt-4">
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-500 mb-1">Total Questions: <span className="text-gray-900">{totalQuestions}</span></div>
                      <div className="text-xs font-bold text-gray-500">Total Marks: <span className="text-gray-900">{totalMarks}</span></div>
                    </div>
                  </div>
              </div>

              {/* Instructions */}
              <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Additional Information (For better output)</label>
                  <div className="relative">
                    <textarea rows={3} value={instructions} onChange={(e)=>setInstructions(e.target.value)} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-gray-400 outline-none transition-colors resize-none placeholder:text-gray-400 placeholder:font-medium" placeholder="e.g. Generate a question paper for 3 hour exam duration..."></textarea>
                    <svg className="absolute bottom-4 right-4 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </div>
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex justify-center flex-col sm:flex-row gap-4 sm:gap-6 mt-8 pb-10">
              <button type="button" onClick={() => window.history.back()} className="px-8 py-3.5 rounded-full border border-gray-300 bg-white font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center min-w-[140px]">
                <span className="mr-2">←</span> Previous
              </button>
              <button disabled={loading || configs.length === 0} type="submit" className="px-8 py-3.5 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 min-w-[140px]">
                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : 'Next'} {!loading && <span className="ml-2">→</span>}
              </button>
            </div>
        </form>
    );
}
