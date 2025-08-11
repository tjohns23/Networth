import express from "express";
import { getContacts, addContact, editContact,deleteContact } from "../controllers/contactController.js";

const router = express.Router();

router.get('/', getContacts);
router.post('/', addContact);
router.put('/:id', editContact);
router.delete('/:id', deleteContact);

export default router;