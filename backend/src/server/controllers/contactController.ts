import Contact, { IContact } from '../models/contact.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
// import type { IContact } from "@types/contact";

// Define interfaces for request bodies and parameters
interface IContactRequestBody {
    company: string;
    name: string;
    role: string;
    email: string;
    numMeetings?: number; // Make optional as it has a default value
    lastMet?: Date;
}

interface IContactUpdateBody {
    company?: string;
    name?: string;
    role?: string;
    email?: string;
    numMeetings?: number;
    lastMet?: Date;
}

interface IParams {
    id: string;
}

// Define a reusable interface for standard error messages
interface IError {
    message: string;
}

// GET all contacts
export const getContacts = async (_req: Request, res: Response<IContact[] | IError>) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// POST create a new contact
export const addContact = async (req: Request<{}, {}, IContactRequestBody>, res: Response<IContact | IError>) => {
    try {
        const contact = new Contact(req.body);
        const savedContact = await contact.save();
        return res.status(201).json(savedContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding contact' });
    }
};

// PUT update/edit contact
export const editContact = async (req: Request<IParams, {}, IContactUpdateBody>, res: Response<IContact | IError>) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        return res.json(updatedContact);
    } catch (error) {
        console.error('Edit contact error: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// DELETE contact
export const deleteContact = async (req: Request<IParams>, res: Response<IError>) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        return res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};