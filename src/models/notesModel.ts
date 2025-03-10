import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the note document
interface INote extends Document {
  name: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const noteSchema = new Schema<INote>({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: "New Note"
  },
  content: {
    type: String
  }
}, { timestamps: true });

// Create and export the model
// Using mongoose.models to check if the model already exists (to avoid Next.js hot-reloading issues)
const NoteModel = mongoose.models.notes || mongoose.model<INote>('notes', noteSchema);

export default NoteModel;