import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

// 1. Define the interface for your document's properties
export interface IContact {
  company: string;
  userId: mongoose.Types.ObjectId; // Changed from string to ObjectId for proper MongoDB reference
  name: string;
  role: string;
  email: string;
  numMeetings: number;
  lastMet?: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define a type for a hydrated (populated from DB) document
export type ContactDocument = HydratedDocument<IContact>;

// 3. Create the schema, with the interface as a generic type
const contactSchema = new Schema<IContact>({
  company: { type: String, required: true },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Added userId field to the schema
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  numMeetings: { type: Number, default: 0 },
  lastMet: { type: Date }
}, { timestamps: true }); // Added timestamps for createdAt/updatedAt

// 4. Create the model and export it with its type
// The first generic is the document interface, the second is the model interface
const Contact: Model<IContact> = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;