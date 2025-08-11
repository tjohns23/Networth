import Contact from '../models/contact.js';
import mongoose from 'mongoose';

// GET all contacts
export const getContacts = async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
};

// POST create a new contact
export const addContact = async (req, res) => {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
};

// PUT update/edit contact
export const editContact = async (req, res) => {
    try {
        console.log('Editing contact...');
        const { id } = req.params;
        console.log('Got id: ', id);

        if (!id){
            console.error('Contact ID not available');
            return res.status(400).json({ message: 'Contact ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('Invalid contact ID');
            return res.status(400).json({ message: 'Invalid contact ID' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!updatedContact) {
            console.error('Contact not found');
            res.status(404).json({ message: 'Contact not found' });
        }

        console.log('Returning the contact');
        res.json(updatedContact);
    } catch (error) {
        console.error('Edit contact error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// DELETE contact
export const deleteContact = async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
}

