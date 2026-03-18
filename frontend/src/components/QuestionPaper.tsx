'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { socket } from '@/lib/socket';
import { Download, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Link from 'next/link';

interface QuestionPaperProps {
  assignmentId: string;
}

export default function QuestionPaper({ assignmentId }: QuestionPaperProps) {
  const { assignments, setAssignment } = useStore();
  const assignment = assignments[assignmentId];
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    
    socket.on('assessment:status', (data) => {
      if (data.id === assignmentId) {
        setAssignment(assignmentId, { ...assignments[assignmentId], status: data.status });
      }
    });

    socket.on('assessment:completed', (data) => {
      if (data._id === assignmentId) {
        setAssignment(assignmentId, data);
        setLoading(false);
      }
    });

    return () => {
      socket.off('assessment:status');
      socket.off('assessment:completed');
      socket.disconnect();
    };
  }, [assignmentId]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments/${assignmentId}`)
      .then(res => res.json())
      .then(data => {
        setAssignment(assignmentId, data);
        if (data.status === 'COMPLETED' || data.status === 'FAILED') setLoading(false);
      });
  }, [assignmentId]);

  if (!assignment) return <div className="flex justify-center mt-20"><Loader2 className="w-10 h-10 animate-spin text-gray-500" /></div>;

  if (assignment.status === 'PENDING' || assignment.status === 'GENERATING') {
    return (
      <div className="flex flex-col items-center justify-center mt-32 space-y-6">
        <Loader2 className="w-16 h-16 animate-spin text-[#FF6A3D]" />
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Crafting Assessment...</h2>
        <p className="text-lg text-gray-500 max-w-md text-center">Our AI is analyzing your parameters and constructing a tailored question paper. Hold tight!</p>
      </div>
    );
  }

  if (assignment.status === 'FAILED') {
    return <div className="text-center mt-20 text-red-600 text-xl font-bold">Failed to generate assessment. Please try again.</div>;
  }

  const downloadPDF = async () => {
    if (!pdfRef.current) return;
    try {
        const dataUrl = await toPng(pdfRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (pdfRef.current.offsetHeight * pdfWidth) / pdfRef.current.offsetWidth;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${assignment.title.replace(/\s+/g, '_')}_Paper.pdf`);
    } catch(err) {
        console.error('Failed to generate PDF', err);
        alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="w-full relative pb-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-bold mb-6 hover:text-gray-900 cursor-pointer w-fit">
        <Link href="/" className="flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Create New</Link>
      </div>

      <div className="bg-[#1E1E1E] text-white rounded-[32px] p-8 mb-8 shadow-md">
        <h3 className="text-[17px] font-medium leading-relaxed mb-6">
          Certainly, Instructor! Here is the customized Question Paper for your <span className="font-bold text-[#FF6A3D]">{assignment.title}</span> class.
        </h3>
        <button onClick={downloadPDF} className="flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Download as PDF
        </button>
      </div>

      {/* Paper Container */}
      <div ref={pdfRef} className="bg-white px-12 py-16 shadow-lg rounded-2xl border border-gray-200 min-h-[1056px] mx-auto text-black font-serif" style={{ maxWidth: '210mm' }}>
        
        {/* Header content centered */}
        <div className="text-center mb-10 pb-6 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-black mb-3 font-sans">Delhi Public School, Sector-4, Bokaro</h1>
          <h2 className="text-lg font-bold text-black font-sans">Subject: {assignment.title || 'General'}</h2>
          <h3 className="text-lg font-bold text-black font-sans">Class: 8th</h3>
        </div>

        <div className="flex justify-between items-center text-[15px] font-bold text-black mb-6">
          <span>Time Allowed: 45 minutes</span>
          <span>Maximum Marks: {assignment.totalMarks}</span>
        </div>

        <p className="text-[15px] font-bold text-black mb-8">All questions are compulsory unless stated otherwise.</p>

        {/* Student Info Lines */}
        <div className="mb-10 space-y-3 font-bold text-[15px]">
          <div className="flex">Name: <span className="ml-2 border-b border-black flex-1 max-w-[300px]"></span></div>
          <div className="flex">Roll Number: <span className="ml-2 border-b border-black flex-1 max-w-[300px]"></span></div>
          <div className="flex">Class: <span className="ml-2">__________</span><span className="ml-6">Section:</span><span className="ml-2 border-b border-black flex-1 max-w-[150px]"></span></div>
        </div>

        {/* Questions */}
        <div className="space-y-12">
          {assignment.sections?.map((section: any, idx: number) => (
            <div key={idx} className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-black mb-2">{section.title}</h3>
              </div>
              <div className="mb-6">
                <h4 className="text-[15px] font-bold text-black mb-1">{section.instruction.split('.')[0] || 'Short Answer Questions'}</h4>
                <p className="text-[13px] text-black italic font-medium">{section.instruction}</p>
              </div>

              <div className="space-y-4 text-[14px]">
                {section.questions.map((q: any, qIdx: number) => (
                  <div key={q.id} className="flex flex-col mb-4">
                    <div className="flex">
                      <span className="w-6 shrink-0">{qIdx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-black">
                          [{q.difficulty}] {q.text} <span className="font-bold">[{q.marks} Marks]</span>
                        </p>
                      </div>
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 mt-4 ml-6 text-black">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx} className="flex">
                            <span className="font-medium mr-2">{String.fromCharCode(97 + oIdx)})</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* End of paper */}
        <div className="mt-16 text-[14px] font-bold text-black uppercase tracking-wide">
          End of Question Paper
        </div>

        {/* Answer Key */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <h3 className="text-[17px] font-bold text-black mb-6">Answer Key:</h3>
          <div className="space-y-4 text-[14px] text-black">
            {assignment.sections?.map((section: any) => 
               section.questions.map((q: any, idx: number) => (
                 <div key={q.id || idx} className="flex">
                   <span className="w-6 shrink-0">{q.id}.</span>
                   <div className="flex-1 text-black font-medium leading-relaxed">
                     {q.answer || "Answer not provided by AI for this question."}
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
