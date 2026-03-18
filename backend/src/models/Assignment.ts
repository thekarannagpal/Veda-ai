import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  instructions: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  sections?: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Moderate', 'Hard'] },
  marks: { type: Number, required: true },
  options: { type: [String], default: [] },
  answer: { type: String, required: false }
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true }
});

const AssignmentSchema = new Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: { type: [String], required: true },
  numberOfQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String, default: '' },
  status: { type: String, enum: ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  sections: { type: [SectionSchema], default: [] }
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
