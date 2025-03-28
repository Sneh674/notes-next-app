import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the user document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

// Create the schema
const logSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp: { type: String, default: "" },
  expiresAt: { type: Date, default: Date.now },
  verified: { type: Boolean, required: true, default: false },
});

// Create and export the model
// Using mongoose.models to check if the model already exists (to avoid Next.js hot-reloading issues)
const UserModel = mongoose.models.loggeduser || mongoose.model<IUser>('loggeduser', logSchema);

export default UserModel;