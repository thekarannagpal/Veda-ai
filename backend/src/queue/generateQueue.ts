import { Queue, Worker, Job } from 'bullmq';
import redisConnection from '../config/redis';
import { Assignment } from '../models/Assignment';
import { generateAssessment } from '../services/aiService';
import { io } from '../../server';

export const generateQueue = new Queue('generate-assessment', {
  connection: redisConnection as any,
});

const worker = new Worker('generate-assessment', async (job: Job) => {
  const { assignmentId, pdfText } = job.data;
  console.log(`Processing job for assignment ${assignmentId}`);
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');
    
    assignment.status = 'GENERATING';
    await assignment.save();
    
    // Notify frontend
    io.emit('assessment:status', { id: assignmentId, status: 'GENERATING' });
    
    // Generate AI assessment
    const generatedSections = await generateAssessment(assignment, pdfText);
    
    // Save to DB
    assignment.sections = generatedSections;
    assignment.status = 'COMPLETED';
    await assignment.save();
    
    // Notify frontend of completion
    io.emit('assessment:status', { id: assignmentId, status: 'COMPLETED' });
    io.emit('assessment:completed', assignment);
    
    return assignment;
  } catch (error) {
    console.error('Job failed:', error);
    
    const assignment = await Assignment.findById(assignmentId);
    if (assignment) {
      assignment.status = 'FAILED';
      await assignment.save();
      io.emit('assessment:status', { id: assignmentId, status: 'FAILED' });
    }
    throw error;
  }
}, { connection: redisConnection as any });

worker.on('failed', (job: Job | undefined, err: Error) => {
  console.log(`Job failed with reason: ${err.message}`);
});
