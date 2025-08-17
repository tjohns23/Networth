import Contact from '../models/contact.js';
import mongoose from 'mongoose';
// GET all contacts
export const getContacts = async (_req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};
// POST create a new contact
export const addContact = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const savedContact = await contact.save();
        return res.status(201).json(savedContact);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding contact' });
    }
};
// PUT update/edit contact
export const editContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        return res.json(updatedContact);
    }
    catch (error) {
        console.error('Edit contact error: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// DELETE contact
export const deleteContact = async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        return res.json({ message: 'Contact deleted' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
