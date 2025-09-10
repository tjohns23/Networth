import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Framework, { IFramework, FrameworkDocument } from '../models/framework.js';

// Types for API requests
interface IFrameworkRequestBody {
    title: string;
    acronym: string;
    topics: Array<{
        letter: string;
        topic: string;
    }>;
    color: string;
}

interface IError {
    message: string;
}

// GET all frameworks for the authenticated user
export const getFrameworks = async (req: Request, res: Response<FrameworkDocument[] | IError>) => {
    try {
        // Check if user is authenticated (middleware should ensure this)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Only fetch frameworks belonging to the authenticated user
        const frameworks = await Framework.find({ userId: req.user.id });
        return res.json(frameworks);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Error fetching frameworks' });
    }
};

// POST create a new framework for the authenticated user
export const addFramework = async (req: Request<{}, {}, IFrameworkRequestBody>, res: Response<FrameworkDocument | IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Validate required fields
        const { title, acronym, topics, color } = req.body;
        if (!title || !acronym || !topics || !color) {
            return res.status(400).json({ message: 'Missing required fields: title, acronym, topics, color' });
        }

        // Validate topics array
        if (!Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ message: 'Topics must be a non-empty array' });
        }

        // Validate each topic has letter and topic fields
        for (const topic of topics) {
            if (!topic.letter || !topic.topic) {
                return res.status(400).json({ message: 'Each topic must have letter and topic fields' });
            }
        }

        // Create framework data with userId from authenticated user
        console.log('Framework Data: ', req.body);
        const frameworkData = {
            ...req.body,
            userId: new mongoose.Types.ObjectId(req.user.id)
        };

        const framework = new Framework(frameworkData);
        console.log('Frameowrk: ', framework);
        const savedFramework = await framework.save();
        
        return res.status(201).json(savedFramework);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding framework' });
    }
};

// PUT update an existing framework
export const editFramework = async (req: Request<{ id: string }, {}, IFrameworkRequestBody>, res: Response<FrameworkDocument | IError>) => {
    try {
        console.log('In the backend edit framework function');
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const { title, acronym, topics, color } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid framework ID' });
        }

        // Validate required fields
        if (!title || !acronym || !topics || !color) {
            return res.status(400).json({ message: 'Missing required fields: title, acronym, topics, color' });
        }

        // Validate topics array
        if (!Array.isArray(topics) || topics.length === 0) {
            return res.status(400).json({ message: 'Topics must be a non-empty array' });
        }

        // Find framework and ensure it belongs to the authenticated user
        const framework = await Framework.findOne({ 
            _id: id, 
            userId: req.user.id 
        });
        console.log('5');

        if (!framework) {
            return res.status(404).json({ message: 'Framework not found or unauthorized' });
        }

        // Update framework
        const updatedFramework = await Framework.findByIdAndUpdate(
            id,
            { title, acronym, topics, color },
            { new: true, runValidators: true }
        );

        return res.json(updatedFramework!);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating framework' });
    }
};

// DELETE a framework
export const deleteFramework = async (req: Request<{ id: string }>, res: Response<{ message: string }>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid framework ID' });
        }

        // Find and delete framework, ensuring it belongs to the authenticated user
        const framework = await Framework.findOneAndDelete({ 
            _id: id, 
            userId: req.user.id 
        });

        if (!framework) {
            return res.status(404).json({ message: 'Framework not found or unauthorized' });
        }

        return res.json({ message: 'Framework deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting framework' });
    }
};

// GET single framework by ID
export const getFrameworkById = async (req: Request<{ id: string }>, res: Response<FrameworkDocument | IError>) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid framework ID' });
        }

        // Find framework and ensure it belongs to the authenticated user
        const framework = await Framework.findOne({ 
            _id: id, 
            userId: req.user.id 
        });

        if (!framework) {
            return res.status(404).json({ message: 'Framework not found or unauthorized' });
        }

        return res.json(framework);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching framework' });
    }
};