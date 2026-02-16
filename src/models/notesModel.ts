import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the note document
interface INote extends Document {
  name: string;
  email: string;
  title: string;
  content: string;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const noteSchema = new Schema<INote>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: "New Note"
  },
  content: {
    type: String
  },
  embedding: {
    type: [Number],
    default: []
  },
}, { timestamps: true });

// Create and export the model
// Using mongoose.models to check if the model already exists (to avoid Next.js hot-reloading issues)
const NoteModel = mongoose.models.notes || mongoose.model<INote>('notes', noteSchema);

export default NoteModel;