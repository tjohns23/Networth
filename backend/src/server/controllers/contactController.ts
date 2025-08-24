import Contact, { IContact } from '../models/contact.js';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';

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

// GET all contacts for the authenticated user
export const getContacts = async (req: Request, res: Response<IContact[] | IError>) => {
    try {
        // Check if user is authenticated (middleware should ensure this)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Only fetch contacts belonging to the authenticated user
        const contacts = await Contact.find({ userId: req.user.id });
        return res.json(contacts);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// POST create a new contact for the authenticated user
export const addContact = async (req: Request<{}, {}, IContactRequestBody>, res: Response<IContact | IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Create contact data with userId from authenticated user
        const contactData = {
            ...req.body,
            userId: new mongoose.Types.ObjectId(req.user.id)
        };

        const contact = new Contact(contactData);
        const savedContact = await contact.save();
        
        return res.status(201).json(savedContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding contact' });
    }
};

// PUT update/edit contact (only if it belongs to the authenticated user)
export const editContact = async (req: Request<IParams, {}, IContactUpdateBody>, res: Response<IContact | IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }

        // Only update if the contact belongs to the authenticated user
        const updatedContact = await Contact.findOneAndUpdate(
            { 
                _id: id, 
                userId: req.user.id // Ensure user can only edit their own contacts
            },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found or access denied' });
        }

        return res.json(updatedContact);
    } catch (error) {
        console.error('Edit contact error: ', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// DELETE contact (only if it belongs to the authenticated user)
export const deleteContact = async (req: Request<IParams>, res: Response<IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }

        // Only delete if the contact belongs to the authenticated user
        const deletedContact = await Contact.findOneAndDelete({ 
            _id: id, 
            userId: req.user.id // Ensure user can only delete their own contacts
        });
        
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact not found or access denied' });
        }
        
        return res.json({ message: 'Contact deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// GET single contact by ID (only if it belongs to the authenticated user)
export const getContactById = async (req: Request<IParams>, res: Response<IContact | IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;

        // Validate contact ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }

        // Find contact only if it belongs to the authenticated user
        const contact = await Contact.findOne({ 
            _id: id, 
            userId: req.user.id 
        });
        
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found or access denied' });
        }
        
        return res.json(contact);
    } catch (error) {
        console.error('Get contact by ID error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};