import QuestionPaper from '@/components/QuestionPaper';

export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <QuestionPaper assignmentId={id} />
    </div>
  );
}
