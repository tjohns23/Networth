import express from "express";
import { getContacts, addContact, editContact, deleteContact } from "../controllers/contactController.js";
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();
// Apply authentication to all contact routes
router.use(authenticateUser);

router.get('/', getContacts);
router.post('/', addContact);
router.put('/:id', editContact);
router.delete('/:id', deleteContact);

export default router;