import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Assignment } from '../models/Assignment';
import { generateQueue } from '../queue/generateQueue';
const pdf = require('pdf-parse');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/assignments', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, dueDate, questionTypes, numberOfQuestions, totalMarks, instructions } = req.body;
        
        let pdfText = '';
        if (req.file) {
            if (req.file.mimetype === 'application/pdf') {
                const data = await pdf(req.file.buffer);
                pdfText = data.text;
            } else {
                pdfText = req.file.buffer.toString('utf-8');
            }
        }

        const assignment = new Assignment({
            title,
            dueDate: new Date(dueDate),
            questionTypes: JSON.parse(questionTypes),
            numberOfQuestions: parseInt(numberOfQuestions),
            totalMarks: parseInt(totalMarks),
            instructions: instructions || '',
            status: 'PENDING'
        });

        await assignment.save();

        // Add job to queue
        await generateQueue.add('generate', { 
            assignmentId: assignment._id, 
            pdfText 
        });

        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create assignment' });
    }
});

router.get('/assignments/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        res.json(assignment);
    } catch(error) {
        res.status(500).json({ error: 'Error fetching assignment' });
    }
});

export default router;
