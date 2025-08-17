import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';

// 1. Define the interface for your document's properties
export interface IContact {
  company: string;
  name: string;
  role: string;
  email: string;
  numMeetings: number;
  lastMet?: Date;
}

// 2. Define a type for a hydrated (populated from DB) document
export type ContactDocument = HydratedDocument<IContact>;

// 3. Create the schema, with the interface as a generic type
const contactSchema = new Schema<IContact>({
  company: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  numMeetings: { type: Number, default: 0 },
  lastMet: { type: Date }
});

// 4. Create the model and export it with its type
// The first generic is the document interface, the second is the model interface
const Contact: Model<IContact> = mongoose.model<IContact>('Contact', contactSchema);

export default Contact;