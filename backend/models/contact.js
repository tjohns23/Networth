import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
        company: String,
        name: String,
        role: String,
        email: String,
        numMeetings: String,
        lastMet: String
});


export default mongoose.model("Contact", contactSchema);