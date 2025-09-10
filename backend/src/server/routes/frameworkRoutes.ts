import express from "express";
import { getFrameworks, addFramework, editFramework, deleteFramework } from "../controllers/frameworkController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticateUser);

router.get('/', getFrameworks);
router.post('/', addFramework);
router.put('/:id', editFramework);
router.delete('/:id', deleteFramework);

export default router;