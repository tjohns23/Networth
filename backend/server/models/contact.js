import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  company: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  numMeetings: { type: Number, default: 0 },
  lastMet: { type: Date }
});

export default mongoose.model('Contact', contactSchema);
