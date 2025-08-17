import mongoose, { Schema } from 'mongoose';
// 3. Create the schema, with the interface as a generic type
const contactSchema = new Schema({
    company: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    numMeetings: { type: Number, default: 0 },
    lastMet: { type: Date }
});
// 4. Create the model and export it with its type
// The first generic is the document interface, the second is the model interface
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
